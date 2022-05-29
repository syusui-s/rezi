import AppLayout from '@/components/AppLayout';
import { Link } from 'solid-app-router';

// TODO: ライセンスファイルをpublicに配置し、リンクを載せる
const About = () => (
  <AppLayout
    titleElement="Reziについて"
    prevElement={
      <Link href="/" class="navigationButton">
        ←
      </Link>
    }
  >
    <div class="p-2">
      <h2 class="mb-4 text-2xl">バージョン情報</h2>

      <p class="mb-4">Rezi v0.0.0</p>

      <h2 class="mb-4 text-2xl">利用規約</h2>

      <p class="mb-4">Copyright (C) 2022 Shusui Moyatani</p>

      <p class="mb-4">
        このプログラムはフリーソフトウェアです。
        あなたはこれを、フリーソフトウェア財団によって発行された
        GNU一般公衆利用許諾書（バージョン3か、それ以降のバージョンのうちどれか）が定める条件の下で
        再頒布または改変することができます。
      </p>

      <p class="mb-4">
        このプログラムは有用であることを願って頒布されますが、 <em>全くの無保証</em> です。
        商業可能性の保証や特定目的への適合性は、言外に示されたものも含め、全く存在しません。
        詳しくはGNU一般公衆利用許諾書をご覧ください。
      </p>

      <p class="mb-4">
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
    </div>
  </AppLayout>
);

export default About;
