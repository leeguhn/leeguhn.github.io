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
        support creative practice. In particular, I explore how such systems
        can:
      </p>

      <ol>
        <li>lower technical barriers to creative production;</li>
        <li>help people reason with space and time as materials for design;</li>
        <li>
          and function as scaffolds that enable users to focus on aspects where
          imagination and personal authorship can come to life.
        </li>
      </ol>

      <p>
        More broadly, I am interested in how interfaces can help people work
        meaningfully with constraints and translate ideas into tangible or
        interactive forms.
      </p>

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
          DioramaCraft: A Human-AI Workflow for Transforming Personal
          Photographs into Layered Paper Theater Dioramas (UIST 2026 Adjunct,
          forthcoming)
        </p>

        <p className="publication-authors">
          Guhn Lee, Heejin Kim, Jiyoon Lee, Donggun Lee, Tak Yeon Lee
        </p>

        <p className="publication">
          Ambient Witness: Repurposing the Language Barrier as a Covert Safety
          Net in Domestic and Workplace Conflicts (CHI 2026 Early Abstracts){' '}
          <a href="https://dl.acm.org/doi/10.1145/3772363.3798859">
            [paper]
          </a>
        </p>

        <p className="publication-authors">
          Guhn Lee*, Dilnurakhon Tulanova*, Dongyeon Yang, Schein Baek, Junehwa Song
        </p>

        <p className="publication">
          Passthrough Interpretive Assistant: Revealing Hidden Intent and Bias
          in eXtended Reality with AI (HCI Korea 2026){' '}
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
