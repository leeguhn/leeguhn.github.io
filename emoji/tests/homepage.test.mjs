import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const appCss = await readFile(new URL('../src/App.css', import.meta.url), 'utf8');
const indexCss = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

test('homepage contains the complete approved profile and contact link', () => {
  const visibleText = app.replace(/\s+/g, ' ');
  assert.match(visibleText, /Guhn Lee/);
  assert.match(visibleText, /second-year master/);
  assert.match(visibleText, /lower technical barriers to creative production/);
  assert.match(visibleText, /reduce repetitive and logistical work while preserving creative judgment/);
  assert.match(visibleText, /reason with space and time as materials for design/);
  assert.match(visibleText, /work meaningfully with constraints/);
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

test('homepage uses a plain responsive black-and-white treatment with a blue email', () => {
  assert.match(indexCss, /background:\s*#fff/);
  assert.match(indexCss, /color:\s*#000/);
  assert.match(indexCss, /font-family:\s*"Helvetica Neue", Helvetica, Arial, sans-serif/);
  assert.match(appCss, /max-width:\s*720px/);
  assert.match(appCss, /\.contact\s+a\s*\{[^}]*color:\s*#0000ee/s);
  assert.match(appCss, /@media\s*\(max-width:\s*600px\)/);
});

test('homepage lists the three approved publications in reverse chronological order', () => {
  const visibleText = app.replace(/\s+/g, ' ');
  const contactPosition = visibleText.indexOf('leeguhn@kaist.ac.kr');
  const publicationsPosition = visibleText.indexOf('Publications');
  const dioramaPosition = visibleText.indexOf('DioramaCraft:');
  const ambientPosition = visibleText.indexOf('Ambient Witness:');
  const passthroughPosition = visibleText.indexOf('Passthrough Interpretive Assistant:');

  assert.ok(publicationsPosition > contactPosition);
  assert.ok(dioramaPosition > publicationsPosition);
  assert.ok(ambientPosition > dioramaPosition);
  assert.ok(passthroughPosition > ambientPosition);

  assert.match(visibleText, /DioramaCraft: A Human-AI Workflow for Transforming Personal Photographs into Layered Paper Theater Dioramas/);
  assert.match(visibleText, /UIST 2026 Adjunct, forthcoming/);
  assert.match(visibleText, /Ambient Witness: Repurposing the Language Barrier as a Covert Safety Net in Domestic and Workplace Conflicts/);
  assert.match(visibleText, /CHI 2026 Early Abstracts/);
  assert.match(visibleText, /Passthrough Interpretive Assistant: Revealing Hidden Intent and Bias in eXtended Reality with AI/);
  assert.match(visibleText, /HCI Korea 2026/);
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
  assert.equal((app.match(/className="publication-authors"/g) || []).length, 3);
});
