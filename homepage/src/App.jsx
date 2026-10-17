import './App.css';

function App() {
  return (
    <main className="profile">
      <h1>Guhn Lee</h1>

      <p>
        I am a second-year master&apos;s student in the Department of
        Industrial Design at KAIST, advised by Prof. Andrea Bianchi at Make
        Lab.
      </p>

      <p>
        I am interested in designing interactive systems and tools that
        support creative practice. In particular, I am exploring how to:
      </p>

      <ol>
        <li>lower technical barriers to creative production;</li>
        <li>
          break down ways of working into layers of technique, perception, and
          judgment that can be studied and remixed;
        </li>
        <li>
          and reexamine how AI can be trained and designed to support the
          creative process more deeply.
        </li>
      </ol>

      <p>
        Prior to my current program, I received an MFA in Visual Arts from the
        University of Chicago and studied art, computer science, and
        linguistics at Grinnell College.
      </p>

      <p className="contact">
        <a href="mailto:leeguhn@kaist.ac.kr">leeguhn@kaist.ac.kr</a>
      </p>

      <section className="publications" aria-labelledby="publications-heading">
        <h2 id="publications-heading">Publications</h2>

        <p className="publication">
          <strong>ModuFold: Semantic Authoring of Origamic Architecture</strong>{' '}
          (ACM SCF 2026 Demo)
        </p>

        <p className="publication-authors">
          Guhn Lee*, Jaewon You*, Haeri Kim, Andrea Bianchi
        </p>

        <p className="publication">
          <strong>
            AdapTest: Supporting Designers in Authoring and Evaluating
            Environmentally Responsive User Interfaces for Extended Reality
          </strong>{' '}
          (ACM ISS 2026)
        </p>

        <p className="publication-authors">
          Jungwoo Rhee, Guhn Lee, Yumin Jung, Mustafa Doga Dogan, Justin Moon,
          Andrea Bianchi
        </p>

        <p className="publication">
          <strong>
            DioramaCraft: A Human-AI Workflow for Transforming Personal
            Photographs into Layered Paper Theater Dioramas
          </strong>{' '}
          (UIST 2026 Adjunct, forthcoming)
        </p>

        <p className="publication-authors">
          Guhn Lee, Heejin Kim, Jiyoon Lee, Donggun Lee, Tak Yeon Lee
        </p>

        <p className="publication">
          <strong>
            Ambient Witness: Repurposing the Language Barrier as a Covert Safety
            Net in Domestic and Workplace Conflicts
          </strong>{' '}
          (CHI 2026 Early Abstracts){' '}
          <a href="https://dl.acm.org/doi/10.1145/3772363.3798859">
            [paper]
          </a>
        </p>

        <p className="publication-authors">
          Guhn Lee*, Dilnurakhon Tulanova*, Dongyeon Yang, Schein Baek, Junehwa Song
        </p>

        <p className="publication">
          <strong>
            Passthrough Interpretive Assistant: Revealing Hidden Intent and Bias
            in eXtended Reality with AI
          </strong>{' '}
          (HCI Korea 2026){' '}
          <a href="https://make.kaist.ac.kr/files/2026/LeeG_Bias_KHCI26.pdf">
            [paper]
          </a>
        </p>

        <p className="publication-authors">
          Guhn Lee, Anam Ahmad Khan, Andrea Bianchi
        </p>
      </section>
    </main>
  );
}

export default App;
