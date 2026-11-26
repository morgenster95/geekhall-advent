/**
 * Pravidla soutěží adventního kalendáře: stránka /?pravidla
 * Znění je návrh – před spuštěním ho ověřte (pořadatel, ceny, termíny).
 */
import { OPERATOR, PRIVACY_URL } from '../content';
import { Logo } from './Decor';

export function Rules() {
  return (
    <main className="rules-page wrap">
      <article className="rules-card">
        <a href="./" className="rules-logo"><Logo /></a>
        <h1>Pravidla soutěží Adventního kalendáře Geekhall 2026</h1>

        <h2>Společná pravidla (platí pro všechny 3 soutěže)</h2>

        <h3>Pořadatel</h3>
        <p>Pořadatelem soutěží v adventním kalendáři Geekhall je společnost <b>{OPERATOR.name}</b>, se sídlem {OPERATOR.address}, IČ: {OPERATOR.ico} (dále jen „pořadatel“).</p>

        <h3>Kdo se může zapojit</h3>
        <p>Soutěží se může zúčastnit fyzická osoba starší 18 let s doručovací adresou v České republice. Ze soutěží jsou vyloučeni zaměstnanci pořadatele a jejich blízké osoby.</p>

        <h3>Podmínky účasti</h3>
        <p>Účast je zdarma a není podmíněna nákupem. Do každé soutěže se může jeden účastník zapojit jen jednou, s jednou e-mailovou adresou. Odesláním přihlášky účastník souhlasí s těmito pravidly.</p>

        <h3>Kontakt s výhercem</h3>
        <p>Výherce pořadatel kontaktuje e-mailem uvedeným v přihlášce. Pokud výherce neodpoví do 3 dnů, výhra propadá a pořadatel stejným způsobem určí náhradního výherce.</p>

        <h3>Výhra</h3>
        <p>Výhru nelze vyměnit za peníze ani za jiné plnění. Výhru pořadatel zašle výherci e-mailem (poukaz) nebo po dohodě poštou.</p>

        <h3>Osobní údaje</h3>
        <p>Pořadatel jako správce zpracovává e-mail účastníka (u soutěže o nejlepší geek koutek také zaslanou fotografii) za účelem organizace soutěže a kontaktování výherce, a to po dobu 3 měsíců od vyhlášení výsledků. Údaje nepředává dalším osobám. Účastník má právo na přístup ke svým údajům, jejich opravu, výmaz a omezení zpracování a může podat stížnost u Úřadu pro ochranu osobních údajů. Kontakt: <a href={'mailto:' + OPERATOR.email}>{OPERATOR.email}</a>. Více v <a href={PRIVACY_URL} target="_blank" rel="noreferrer">zásadách ochrany osobních údajů</a>.</p>

        <h3>Ostatní</h3>
        <p>Pořadatel může soutěž změnit nebo zrušit a vyloučit účastníka, který porušuje pravidla nebo jedná nepoctivě. Výhru nelze vymáhat soudní cestou. Dotazy k soutěžím: <a href={'mailto:' + OPERATOR.email}>{OPERATOR.email}</a>.</p>

        <h2>Soutěž o poukaz v hodnotě 3 000 Kč (okénko 5. 12.)</h2>
        <ul>
          <li><b>Doba konání:</b> od 5. 12. 2026 do 23. 12. 2026 do 23:59.</li>
          <li><b>Jak se zapojit:</b> v okénku 5. 12. adventního kalendáře vyplnit e-mail a potvrdit souhlas s pravidly.</li>
          <li><b>Výhra:</b> 1× dárkový poukaz do e-shopu Geekhall v hodnotě 3 000 Kč.</li>
          <li><b>Výběr výherce:</b> výherce vylosujeme náhodně ze všech platných přihlášek 24. 12. 2026 a týž den mu pošleme e-mail.</li>
        </ul>

        <h2>Soutěž Kolik balíčků jsme letos odeslali? (okénko 13. 12.)</h2>
        <ul>
          <li><b>Doba konání:</b> od 13. 12. 2026 do 18. 12. 2026 do 23:59.</li>
          <li><b>Jak se zapojit:</b> v okénku 13. 12. adventního kalendáře zadat číselný tip a e-mail a potvrdit souhlas s pravidly.</li>
          <li><b>Výhra:</b> 1× dárkový poukaz do e-shopu Geekhall v hodnotě 1 000 Kč, platný do 31. 1. 2027.</li>
          <li><b>Výběr výherce:</b> vyhrává účastník, jehož tip je nejblíže počtu balíčků, které Geekhall odeslal v roce 2026 podle evidence pořadatele. Při stejně blízkých tipech vyhrává ten, který byl odeslán dříve.</li>
          <li><b>Vyhlášení:</b> výherce vyhlásíme 21. 12. 2026 a pošleme mu e-mail.</li>
        </ul>

        <h2>Soutěž o nejlepší geek koutek (okénko 19. 12.)</h2>
        <ul>
          <li><b>Doba konání:</b> od 19. 12. 2026 do 22. 12. 2026 do 23:59.</li>
          <li><b>Jak se zapojit:</b> v okénku 19. 12. adventního kalendáře nahrát fotografii vlastního geek koutku, vyplnit e-mail a potvrdit souhlas s pravidly. Fotografie musí být vlastní a neupravená.</li>
          <li><b>Výhra:</b> 1× dárkový poukaz do e-shopu Geekhall v hodnotě 2 000 Kč, platný do 31. 1. 2027.</li>
          <li><b>Výběr výherce:</b> výherce vybere komise pořadatele podle toho, který koutek je nejoriginálnější.</li>
          <li><b>Fotografie:</b> účastník uděluje pořadateli bezplatný a nevýhradní souhlas se zveřejněním zaslané fotografie bez uvedení jména na webu a sociálních sítích Geekhall.</li>
          <li><b>Vyhlášení:</b> výherce vyhlásíme 23. 12. 2026 a pošleme mu e-mail.</li>
        </ul>

        <p className="muted">Platné od 1. 12. 2026.</p>
        <a href="./" className="btn primary">Zpět do kalendáře</a>
      </article>
    </main>
  );
}
