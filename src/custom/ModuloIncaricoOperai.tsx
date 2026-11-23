// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ModuloIncaricoOperai");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ModuloIncaricoOperai");
import { useState } from "react";
import { Button, Dialog, TextInput, TextArea, Select, Checkbox, useTable, usePrototype, type CellProps } from "../floware";

export default function ModuloIncaricoOperai({ pageId, rowIndex, value }: CellProps) {__mk();
  const richieste = useTable(pageId);
  const incarichi = useTable("incarichi-operai");
  const { notify } = usePrototype();
  const [aperto, setAperto] = useState(false);
  const [operai, setOperai] = useState<string[]>([]);
  const [attivita, setAttivita] = useState("");
  const [data, setData] = useState("");
  const [luogo, setLuogo] = useState("");
  const [istruzioni, setIstruzioni] = useState("");
  const [stato, setStato] = useState("Da assegnare");
  const [errore, setErrore] = useState("");
  const colonne = ["Codice richiesta", "Operai incaricati", "Attività", "Data intervento", "Luogo", "Istruzioni", "Stato incarico"];
  const disponibili = ["OP-01", "OP-02", "OP-03", "OP-04"];
  if (!richieste || !incarichi || !richieste.rows[rowIndex]) return <span>{value}</span>;
  if (richieste.column("Codice richiesta") < 0 || !colonne.every((nome) => (__mk(), incarichi.column(nome) >= 0))) return <span>{value} · Modulo non disponibile</span>;
  const codice = richieste.value(rowIndex, "Codice richiesta");
  const istituto = richieste.column("Istituto") >= 0 ? richieste.value(rowIndex, "Istituto") : "";
  const indice = incarichi.findRows("Codice richiesta", codice)[0];
  function leggi(nome: string) {__mk();
    return indice === undefined ? "" : incarichi.value(indice, nome);
  }
  function apri() {__mk();
    setOperai(leggi("Operai incaricati").split(", ").filter((voce) => (__mk(), Boolean(voce))));
    setAttivita(leggi("Attività"));
    setData(leggi("Data intervento"));
    setLuogo(leggi("Luogo") || istituto);
    setIstruzioni(leggi("Istruzioni"));
    setStato(leggi("Stato incarico") || "Da assegnare");
    setErrore("");
    setAperto(true);
  }
  function salva() {__mk();
    if (!codice || !operai.length || !attivita.trim() || !data || !luogo.trim()) {
      setErrore("Seleziona almeno un operaio e compila attività, data e luogo.");
      return;
    }
    const valori = [codice, operai.join(", "), attivita.trim(), data, luogo.trim(), istruzioni.trim(), stato];
    const attuale = incarichi.findRows("Codice richiesta", codice)[0];
    if (attuale === undefined) {
      incarichi.addRow({ "Codice richiesta": codice, "Operai incaricati": operai.join(", "), "Attività": attivita.trim(), "Data intervento": data, "Luogo": luogo.trim(), "Istruzioni": istruzioni.trim(), "Stato incarico": stato });
    } else {
      colonne.forEach((nome, i) => (__mk(), incarichi.setCell(attuale, incarichi.column(nome), valori[i])));
    }
    setAperto(false);
    notify("Incarico salvato in memoria per " + codice);
  }
  return (
    <>
      <div className="flex flex-col items-start gap-1">
        <span>{value}</span>
        <Button variant="link" onClick={apri}>Apri incarico</Button>
      </div>
      {aperto && <Dialog title={"Incarico · " + codice} onClose={() => (__mk(), setAperto(false))} footer={<><Button variant="secondary" onClick={() => (__mk(), setAperto(false))}>Annulla</Button><Button onClick={salva}>Salva incarico</Button></>}>
        <div className="space-y-4">
          <div><strong>{istituto}</strong><p className="text-(--mk-muted)">Richiesta {codice}. Dati inventati, conservati solo in memoria.</p></div>
          <div className="space-y-2 rounded-lg border border-(--mk-border) p-3">
            <p>Operai dipendenti incaricati</p>
            <p className="text-(--mk-muted)">Sigle fittizie del personale dimostrativo.</p>
            {disponibili.map((sigla) => (__mk(), <Checkbox key={sigla} label={sigla} checked={operai.includes(sigla)} onChange={(scelto) => (__mk(), setOperai(scelto ? operai.filter((voce) => (__mk(), voce !== sigla)).concat([sigla]) : operai.filter((voce) => (__mk(), voce !== sigla))))} />))}
          </div>
          <TextArea label="Attività da svolgere" value={attivita} onChange={setAttivita} rows={3} />
          <TextInput label="Data intervento" type="date" value={data} onChange={setData} />
          <TextInput label="Luogo intervento" value={luogo} onChange={setLuogo} placeholder="Istituto e locale di fantasia" />
          <TextArea label="Istruzioni operative" value={istruzioni} onChange={setIstruzioni} rows={3} />
          <Select label="Stato incarico" value={stato} options={["Da assegnare", "Assegnato", "In corso", "Sospeso", "Completato"]} onChange={setStato} />
          <p className="text-(--mk-muted)">Lo stato dell’incarico è indipendente dallo stato della richiesta.</p>
          {errore && <p className="text-(--mk-danger)">{errore}</p>}
        </div>
      </Dialog>}
    </>
  );
}
