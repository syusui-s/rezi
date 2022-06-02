import { For, createResource } from 'solid-js';
import { Link } from 'solid-app-router';

import AppLayout from '@/components/AppLayout';

type PackageInfo = {
  self: {
    name: string;
    author: string;
    version: string;
    homepage: string;
    licenceText: string;
  };
  packages: {
    name: string;
    licenceText: string;
  }[];
};

const fetchPackageInfo = async (): Promise<PackageInfo> => {
  const res = await fetch('/packageInfo.json');
  const body = await res.text();
  return JSON.parse(body) as PackageInfo;
};

// TODO: ライセンスファイルをpublicに配置し、リンクを載せる
const About = () => {
  const [packageInfo] = createResource(fetchPackageInfo);

  return (
    <AppLayout
      titleElement="Reziについて"
      prevElement={
        <Link href="/" class="navigationButton">
          ←
        </Link>
      }
    >
      <div class="p-2">
        <h2 class="my-4 text-2xl">バージョン情報</h2>

        <p class="my-4">Rezi v0.0.0</p>

        <h2 class="my-4 text-2xl">利用規約</h2>

        <p class="my-4">Copyright (C) 2022 Shusui Moyatani</p>

        <p class="my-4">
          このプログラムはフリーソフトウェアです。
          あなたはこれを、フリーソフトウェア財団によって発行された
          GNU一般公衆利用許諾書（バージョン3か、それ以降のバージョンのうちどれか）が定める条件の下で
          再頒布または改変することができます。
        </p>

        <p class="my-4">
          このプログラムは有用であることを願って頒布されますが、 <em>全くの無保証</em> です。
          商業可能性の保証や特定目的への適合性は、言外に示されたものも含め、全く存在しません。
          詳しくはGNU一般公衆利用許諾書をご覧ください。
        </p>

        <p class="my-4">
          あなたはこのプログラムと共に、GNU 一般公衆利用許諾書のコピーを一部受け取っているはずです。
          もし受け取っていなければ、
          <a class="link" href="http://www.gnu.org/licenses/">
            http://www.gnu.org/licenses/
          </a>
          をご覧ください。
        </p>

        <a class="link" href="https://gpl.mhatta.org/gpl.ja.html">
          日本語訳
        </a>

        <h2 class="my-4 text-2xl">使用ライブラリ</h2>

        <For each={packageInfo()?.packages ?? []} fallback="取得中">
          {(p) => {
            return (
              <>
                <h3 class="my-4 text-xl">{p.name}</h3>
                <pre class="overflow-scroll p-4 max-h-96 bg-zinc-100 rounded">{p.licenceText}</pre>
              </>
            );
          }}
        </For>
      </div>
    </AppLayout>
  );
};

export default About;
