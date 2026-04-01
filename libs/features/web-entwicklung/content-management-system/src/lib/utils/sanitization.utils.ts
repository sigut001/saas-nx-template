export class CmsSecurityError extends Error {
  constructor(
    public paths: string[],
    message: string,
  ) {
    super(message);
    this.name = 'CmsSecurityError';
  }
}

/**
 * Entfernt radikal alle HTML Tags und gibt nur den reinen Textinhalt zurück.
 * Dies garantiert "Zero HTML" in der Datenbank.
 * Beispiel: <p>hi</p> wird restlos zu "hi" gekürzt.
 */
export function stripHtmlStrict(text: string): string {
  if (typeof text !== 'string') return text;

  // 1. Entferne komplette gefährliche Blöcke (Script, Style) mitsamt ihrem Inhalt
  let clean = text.replace(
    /<(script|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi,
    '',
  );

  // 2. Entferne alle typischen HTML Tags (z.B. <p>, <b>, <br>), behalte aber deren Textinhalt
  clean = clean.replace(/<\/?[a-z][^>]*>/gi, '');

  return clean.trim();
}

/**
 * 1. Rekursiver Type-Guard: Verhindert, dass Hacker über die UI die Datenstrukturen
 *    des JSON manipuliert haben (Bypass NoSQL Injection). Strings müssen Strings bleiben.
 * 2. Hardcore Sanitization: Jeder String wird strikt escaped.
 *
 * @param snapshot Datensatz vor Bearbeitung (als Blueprint/Typenstamm verwendet)
 * @param current Bearbeiteter Datensatz
 * @param currentPath Pfad für Fehlerlogs
 * @returns Sauberes, typensicheres Objekt für die Datenbank
 */
export function verifyAndSanitizePayload(
  snapshot: any,
  current: any,
  currentPath = 'DOCUMENT',
): any {
  if (current === null || current === undefined) return current;

  // Primitives
  if (typeof current !== 'object') {
    // Falls ein direkter Vergleichspartner im Snapshot vorliegt, erzwinge identischen Ursprungstyp!
    if (
      snapshot !== null &&
      snapshot !== undefined &&
      typeof current !== typeof snapshot
    ) {
      throw new CmsSecurityError(
        [currentPath],
        `Unterschiedliche Datentypen erkannt: Feld '${currentPath}' wurde manipuliert (Ursprung: '${typeof snapshot}', Injektion: '${typeof current}').`,
      );
    }

    // Sanitization: Striktes Entfernen von HTML Inhalten! Zero-HTML Policy.
    if (typeof current === 'string') {
      return stripHtmlStrict(current);
    }
    // Zahlen und Boolean-Werte passieren unbehelligt, sie sind XSS-sicher.
    return current;
  }

  // Arrays
  if (Array.isArray(current)) {
    if (
      snapshot !== null &&
      snapshot !== undefined &&
      !Array.isArray(snapshot)
    ) {
      throw new CmsSecurityError(
        [currentPath],
        `Array Injection: Feld '${currentPath}' sollte eigentlich vom Typ '${typeof snapshot}' sein.`,
      );
    }
    return current.map((item, idx) => {
      const snapItem = Array.isArray(snapshot) ? snapshot[idx] : null;
      return verifyAndSanitizePayload(snapItem, item, `${currentPath}[${idx}]`);
    });
  }

  // Verschachtelte Objekte durchflöhen
  const result: any = {};
  for (const key of Object.keys(current)) {
    const nextPath = currentPath === 'DOCUMENT' ? key : `${currentPath}.${key}`;
    const snapValue =
      snapshot !== null && snapshot !== undefined ? snapshot[key] : null;

    result[key] = verifyAndSanitizePayload(snapValue, current[key], nextPath);
  }

  return result;
}
