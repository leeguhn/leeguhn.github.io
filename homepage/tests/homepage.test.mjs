import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appCss = await readFile(new URL('../src/App.css', import.meta.url), 'utf8');
const indexCss = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('homepage contains the preferred profile and contact link', () => {
  const visibleText = app.replace(/\s+/g, ' ');
  assert.match(visibleText, /Guhn Lee/);
  assert.match(visibleText, /second-year master/);
  assert.match(visibleText, /interested in designing interactive systems and tools that support creative practice/);
  assert.match(visibleText, /In particular, I am exploring how to:/);
  assert.match(visibleText, /lower technical barriers to creative production/);
  assert.match(visibleText, /break down ways of working into layers of technique, perception, and judgment that can be studied and remixed/);
  assert.match(visibleText, /and reexamine how AI can be trained and designed to support the creative process more deeply/);
  assert.match(visibleText, /MFA in Visual Arts from the University of Chicago/);
  assert.match(visibleText, /art, computer science, and linguistics at Grinnell College/);
  assert.match(visibleText, /href="mailto:leeguhn@kaist\.ac\.kr"/);
  assert.match(visibleText, />leeguhn@kaist\.ac\.kr</);
});

test('homepage no longer exposes the chatbot experiment interface', () => {
  assert.doesNotMatch(app, /react-router-dom/);
  assert.doesNotMatch(app, /Welcome/);
  assert.doesNotMatch(app, /Experiment/);
  assert.doesNotMatch(app, /Survey/);
  assert.doesNotMatch(app, /Complete/);
  assert.doesNotMatch(app, /ChatWindow/);
  assert.doesNotMatch(app, /firebase/i);
  assert.doesNotMatch(html, /chatbot/i);
  assert.match(html, /<title>Guhn Lee<\/title>/);
});

test('homepage uses CMU Serif with a plain responsive treatment and a blue email', () => {
  assert.match(indexCss, /background:\s*#fff/);
  assert.match(indexCss, /color:\s*#000/);
  assert.match(indexCss, /font-family:\s*'CMU Serif', Georgia, serif/);
  for (const face of ['cmunrm', 'cmunbx', 'cmunti', 'cmunbi']) {
    assert.match(indexCss, new RegExp(`assets/fonts/${face}\\.woff2`));
  }
  assert.match(appCss, /max-width:\s*720px/);
  assert.match(appCss, /\.contact\s+a\s*\{[^}]*color:\s*#0000ee/s);
  assert.match(appCss, /@media\s*\(max-width:\s*600px\)/);
});

test('homepage lists publications in the requested order', () => {
  const visibleText = app.replace(/<\/?strong>/g, '').replace(/\{' '\}/g, ' ').replace(/\s+/g, ' ');
  const contactPosition = visibleText.indexOf('leeguhn@kaist.ac.kr');
  const publicationsPosition = visibleText.indexOf('Publications');
  const moduFoldPosition = visibleText.indexOf('ModuFold:');
  const adapTestPosition = visibleText.indexOf('AdapTest:');
  const dioramaPosition = visibleText.indexOf('DioramaCraft:');
  const ambientPosition = visibleText.indexOf('Ambient Witness:');
  const passthroughPosition = visibleText.indexOf('Passthrough Interpretive Assistant:');

  assert.ok(publicationsPosition > contactPosition);
  assert.ok(moduFoldPosition > publicationsPosition);
  assert.ok(adapTestPosition > moduFoldPosition);
  assert.ok(dioramaPosition > adapTestPosition);
  assert.ok(ambientPosition > dioramaPosition);
  assert.ok(passthroughPosition > ambientPosition);

  assert.match(visibleText, /ModuFold: Semantic Authoring of Origamic Architecture \(ACM SCF 2026 Demo\)/);
  assert.match(visibleText, /AdapTest: Supporting Designers in Authoring and Evaluating Environmentally Responsive User Interfaces for Extended Reality \(ACM ISS 2026\)/);
  assert.match(visibleText, /DioramaCraft: A Human-AI Workflow for Transforming Personal Photographs into Layered Paper Theater Dioramas/);
  assert.match(visibleText, /UIST 2026 Adjunct, forthcoming/);
  assert.match(visibleText, /Ambient Witness: Repurposing the Language Barrier as a Covert Safety Net in Domestic and Workplace Conflicts/);
  assert.match(visibleText, /CHI 2026 Early Abstracts/);
  assert.match(visibleText, /Passthrough Interpretive Assistant: Revealing Hidden Intent and Bias in eXtended Reality with AI/);
  assert.match(visibleText, /HCI Korea 2026/);
  assert.equal((app.match(/<strong>/g) || []).length, 5);
  assert.match(appCss, /\.publications h2\s*\{[^}]*border-bottom:\s*1px solid #000/s);
});

test('publication links label only the paper references', () => {
  const visibleText = app.replace(/\s+/g, ' ');

  assert.doesNotMatch(visibleText, /<a[^>]*>\s*Ambient Witness:/);
  assert.doesNotMatch(visibleText, /<a[^>]*>\s*Passthrough Interpretive Assistant:/);
  assert.match(visibleText, /\(CHI 2026 Early Abstracts\).*?<a href="https:\/\/dl\.acm\.org\/doi\/10\.1145\/3772363\.3798859">\s*\[paper\]\s*<\/a>/);
  assert.match(visibleText, /\(HCI Korea 2026\).*?<a href="https:\/\/make\.kaist\.ac\.kr\/files\/2026\/LeeG_Bias_KHCI26\.pdf">\s*\[paper\]\s*<\/a>/);
});

test('each publication displays its authors in the approved order', () => {
  const visibleText = app.replace(/\s+/g, ' ');

  assert.match(
    visibleText,
    /ModuFold:.*?Guhn Lee\*, Jaewon You\*, Haeri Kim, Andrea Bianchi.*?AdapTest:/,
  );
  assert.match(
    visibleText,
    /AdapTest:.*?Jungwoo Rhee, Guhn Lee, Yumin Jung, Mustafa Doga Dogan, Justin Moon, Andrea Bianchi.*?DioramaCraft:/,
  );
  assert.match(
    visibleText,
    /DioramaCraft:.*?Guhn Lee, Heejin Kim, Jiyoon Lee, Donggun Lee, Tak Yeon Lee.*?Ambient Witness:/,
  );
  assert.match(
    visibleText,
    /Ambient Witness:.*?Guhn Lee\*, Dilnurakhon Tulanova\*, Dongyeon Yang, Schein Baek, Junehwa Song.*?Passthrough Interpretive Assistant:/,
  );
  assert.match(
    visibleText,
    /Passthrough Interpretive Assistant:.*?Guhn Lee, Anam Ahmad Khan, Andrea Bianchi/,
  );
  assert.equal((app.match(/className="publication-authors"/g) || []).length, 5);
});
