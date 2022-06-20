import { For, createResource } from 'solid-js';

import AppLayout from '@/components/AppLayout';
import NavigationDrawer from '@/components/NavigationDrawer';

type PackageInfo = {
  self: {
    name: string;
    author: string;
    version: string;
    homepage: string;
    licenseSpdx: string;
    licenseText: string;
  };
  packages: {
    name: string;
    version: string;
    licenseSpdx: string;
    licenseText: string;
  }[];
};

const fetchPackageInfo = async (): Promise<PackageInfo> => {
  const res = await fetch(`${import.meta.env.BASE_URL}/packageInfo.json`);
  const body = await res.text();
  return JSON.parse(body) as PackageInfo;
};

// TODO: ライセンスファイルをpublicに配置し、リンクを載せる
const About = () => {
  const [packageInfo] = createResource(fetchPackageInfo);

  return (
    <AppLayout titleElement="Reziについて" prevElement={<NavigationDrawer />}>
      <div class="p-2">
        <h2 class="my-4 text-2xl">バージョン情報</h2>

        <div>
          <img src="/src/assets/icon.png" alt="Logo" width="128" height="128" />
        </div>

        <p class="my-4">
          Rezi <span id="app-version">v{packageInfo()?.self?.version}</span>
        </p>

        <h2 class="my-4 text-2xl">利用規約</h2>

        <p class="my-4">Copyright (C) 2022 Shusui Moyatani</p>

        <p class="my-4">
          このプログラムは自由ソフトウェアです。フリーソフトウェア財団から発行された
          GNUアフェロー一般公衆ライセンス（バージョン3か、(任意で)より新しいバージョンのいずれか）の条件の下で
          再頒布や改変、あるいはその両方を行うことができます。
        </p>

        <p class="my-4">
          このプログラムは役立つことを願って頒布されていますが、<em>いかなる保証もありません</em>。
          <em>商品性</em> や <em>特定目的適合性</em>{' '}
          に対する保証は暗示されたものも含めて存在しません。
          詳しくはGNUアフェロー一般公衆ライセンスをご覧ください。
        </p>

        <p class="my-4">
          あなたは、このプログラムに付随してGNUアフェロー一般公衆ライセンスのコピーを受け取っていることでしょう。
          そうでなければ、
          <a class="link" href="https://www.gnu.org/licenses/">
            https://www.gnu.org/licenses/
          </a>
          をご参照ください。
        </p>

        <a class="link" href="https://gpl.mhatta.org/agpl.ja.html">
          参考訳
        </a>

        <pre class="overflow-scroll p-4 max-h-96 bg-zinc-100 rounded">
          {packageInfo()?.self.licenseText}
        </pre>

        <h2 class="my-4 text-2xl">使用ライブラリ</h2>

        <For each={packageInfo()?.packages ?? []} fallback="取得中">
          {(p) => {
            return (
              <>
                <h3 class="my-4 text-xl">
                  {p.name}@{p.version} ({p.licenseSpdx})
                </h3>
                <pre class="overflow-scroll p-4 max-h-96 bg-zinc-100 rounded">{p.licenseText}</pre>
              </>
            );
          }}
        </For>
      </div>
    </AppLayout>
  );
};

export default About;
