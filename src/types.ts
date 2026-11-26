export type DoorType = 'offer' | 'game' | 'tip' | 'contest' | 'finale';

export interface Img { src: string; alt: string; caption?: string }

export interface QuizQuestion { q: string; options: string[]; answer: number; explain?: string; image?: Img }
/** výsledek kvízu podle počtu bodů: platí první, kde score >= min */
export interface QuizVerdict { min: number; text: string }
export interface PersonaQuestion { q: string; options: { t: string; r?: string }[] }
export interface PersonaResult { title: string; text: string; links: { label: string; url: string }[] }

export type Game =
  /** hideAnswers = správnou odpověď neprozrazovat hned (hra o odměnu) */
  | { kind: 'quiz'; questions: QuizQuestion[]; verdicts?: QuizVerdict[]; reward?: string; fail?: string; hideAnswers?: boolean }
  | { kind: 'persona'; questions: PersonaQuestion[]; results: Record<string, PersonaResult> }
  | { kind: 'order'; prompt: string; items: { label: string; year: number; image?: string }[]; win: string; lose: string };

export interface Contest {
  /** email = stačí se zapojit, number = tip čísla, photo = nahrání fotky */
  kind: 'email' | 'number' | 'photo';
  prize: string;
  rules: string;
  /** do kdy se lze zapojit (ISO čas s časovou zónou) */
  until: string;
  placeholder?: string;
}

/** odrážka s volitelnou ukázkovou fotkou */
export type ListItem = string | { text: string; image?: Img };

export interface Door {
  day: number;
  type: DoorType;
  title: string;
  /** úvodní text; prázdný řádek = nový odstavec */
  text: string;
  /** číslovaný seznam (tipy, kroky) */
  list?: ListItem[];
  /** text pod seznamem; prázdný řádek = nový odstavec, jednotlivé řádky zůstávají pod sebou */
  more?: string;
  /** kupón k předložení na pobočce (bez kódu = stačí ukázat okénko) */
  coupon?: { code?: string; value: string; valid: string };
  game?: Game;
  contest?: Contest;
  url?: string;
  urlLabel?: string;
  /** produktové odkazy */
  links?: { label: string; url: string; note?: string }[];
  /** poznámka k potvrzení – zobrazí se jen v režimu draft */
  confirm?: string;
}

export interface User {
  uid: string;
  email: string;
  name: string | null;
}

export interface Progress {
  /** den -> ISO čas otevření */
  opened: Record<number, string>;
  /** dny, ve kterých uživatel odeslal soutěžní odpověď */
  entries: number[];
  newsletter: boolean;
  /** uživatel už odpověděl na nabídku newsletteru (ano i ne) – znovu se neptáme */
  newsletterAsked?: boolean;
}
