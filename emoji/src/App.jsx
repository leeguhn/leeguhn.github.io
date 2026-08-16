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
        <li>reduce repetitive and logistical work while preserving creative judgment; and</li>
        <li>help people reason with space and time as materials for design.</li>
      </ol>

      <p>
        I build scaffolds that allow people to spend more of their attention
        on the decisions where imagination and personal authorship matter.
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
    </main>
  );
}

export default App;
