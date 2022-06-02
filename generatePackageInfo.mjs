import fs from 'fs';
import path from 'path';
import util from 'util';
import licenseChecker from 'license-checker';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const generatePackages = async function (selfName) {
  const packages = await new Promise((resolve, reject) =>
    licenseChecker.init({ start: path.resolve(), production: true }, (err, packages) =>
      err ? reject(err) : resolve(packages),
    ),
  );

  const selfPackageFqdns = Object.keys(packages).filter((name) => !name.startsWith(selfName));
  selfPackageFqdns.forEach((fqdn) => { delete packages[fqdn]; })

  const packagesWithLicense = Object.entries(packages).map(([packageName, packageInfo]) =>
    readFile(packageInfo.licenseFile, { encoding: 'utf8' }).then((licenceText) => ({
      name: packageName,
      repository: packageInfo.repository,
      licenceText,
    }))
  );

  return Promise.all(packagesWithLicense);
};

export default async function generateDependencyJson() {
  const packageJson = await readFile('./package.json', { encoding: 'utf8' });
  const selfPackageInfo = JSON.parse(packageJson);
  const {
    name,
    author,
    version,
    homepage,
  } = selfPackageInfo;

  const packages = await generatePackages(name);
  const myLicense = await readFile('./LICENSE', { encoding: 'utf8' });

  const result = {
    self: {
      name,
      author,
      version,
      homepage,
      licenseText: myLicense,
    },
    packages,
  };

  writeFile('./public/packageInfo.json', JSON.stringify(result), { encoding: 'utf8' });
}
