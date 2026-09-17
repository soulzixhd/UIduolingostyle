## Testul 1 – „Talentul pe care nu știai că îl ai”

**ID test:** `hidden_talent`  
**Scop:** identificarea competențelor naturale prin răspunsuri libere.  
**Format:** text liber, recomandat 1–5 propoziții.  
**Instrucțiune afișată:** „Nu există un răspuns perfect. Scrie primul răspuns care te reprezintă.”

| ID | Întrebare | Dimensiuni principale |
|---|---|---|
| `HT01` | Ai 30 de secunde să convingi o sală întreagă să te asculte. Cu ce propoziție începi? | `COM`, `PER`, `SOC` |
| `HT02` | Primești 1.000 € și 24 de ore să îi transformi în cât mai mulți bani. Ce faci? | `INI`, `PRA`, `ANA`, `CRE` |
| `HT03` | Un prieten are o idee foarte bună, dar nu știe să o prezinte. Cum îl ajuți? | `EMP`, `COM`, `COL` |
| `HT04` | Trebuie să organizezi un eveniment pentru 100 de persoane. Care este primul lucru pe care îl faci? | `ORG`, `LED`, `PRA` |
| `HT05` | Primești un produs complet necunoscut. Cum ai convinge pe cineva să-l cumpere? | `PER`, `CRE`, `COM` |
| `HT06` | Ai voie să schimbi un singur lucru la școala sau facultatea ta. Ce schimbi și de ce? | `VAL`, `ANA`, `INI` |
| `HT07` | Un coleg intră în panică înaintea unei prezentări. Ce îi spui? | `EMP`, `COM`, `COL` |
| `HT08` | Dacă ai avea un canal urmărit de un milion de persoane, despre ce ai vorbi? | `STO`, `CRE`, `VAL`, `SOC` |
| `HT09` | Descrie-te fără să folosești vârsta, studiile, aspectul fizic sau orașul. | `COM`, `AUT`, `VAL` |
| `HT10` | Ai o problemă pe care nimeni din grup nu știe să o rezolve. Ce faci? | `ANA`, `RES`, `INI`, `COL` |

### Indicații pentru analiza AI

- identifică acțiunea propusă, motivația și persoanele luate în calcul;
- caută dovezi concrete pentru fiecare dimensiune;
- nu acorda scor mare doar pentru un răspuns lung;
- umorul este un semnal separat, nu echivalentul creativității;
- dacă răspunsul este prea scurt sau ambiguu, marchează încrederea evaluării ca scăzută.

---

## Testul 2 – „Alege imaginea care te reprezintă”

**ID test:** `visual_preferences`  
**Scop:** explorarea preferințelor pentru mediu, activitate, autonomie și interacțiune.  
**Format:** alegere unică dintre 4 imagini.  
**Cerință UI:** imaginile trebuie să aibă același stil, luminozitate și atractivitate pentru a reduce influența esteticii.

### VP01 – În ce spațiu ai lucra cu plăcere?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | studio creativ colorat | `CRE +3`, `SOC +1` |
| B | birou de companie cu echipă | `COL +2`, `LED +1`, `ORG +1` |
| C | birou individual minimalist | `AUT +3`, `ORG +1` |
| D | spațiu de lucru în aer liber | `ADA +2`, `AUT +1`, `CRE +1` |

### VP02 – Ce obiect ai alege instinctiv?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | microfon | `COM +2`, `SOC +2` |
| B | laptop cu grafice | `ANA +3`, `ORG +1` |
| C | aparat foto | `CRE +2`, `OBS +2` |
| D | carnețel cu schițe | `STO +2`, `CRE +1`, `AUT +1` |

### VP03 – Ce scenă te atrage cel mai mult?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | scenă cu public | `SOC +3`, `COM +1` |
| B | laborator modern | `ANA +2`, `OBS +2` |
| C | ședință de strategie | `LED +2`, `ORG +1`, `COL +1` |
| D | atelier de creație | `CRE +3`, `PRA +1` |

### VP04 – Alege drumul care te atrage

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | autostradă către oraș | `ORG +2`, `PRA +1` |
| B | drum prin pădure | `OBS +2`, `AUT +1` |
| C | stradă urbană aglomerată | `SOC +2`, `ADA +2` |
| D | potecă de munte | `RES +2`, `AUT +2` |

### VP05 – Ce atmosferă preferi?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | cameră colorată și expresivă | `CRE +3`, `SOC +1` |
| B | cameră elegantă, formală | `ORG +2`, `LED +1` |
| C | cameră foarte ordonată | `ORG +3`, `ANA +1` |
| D | cameră confortabilă și caldă | `EMP +2`, `COL +1`, `VAL +1` |

### VP06 – Ce rol te atrage într-un grup?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | persoana care vorbește | `COM +2`, `SOC +2` |
| B | persoana care ascultă | `EMP +3`, `OBS +1` |
| C | persoana care organizează | `ORG +2`, `LED +2` |
| D | persoana care face lumea să râdă | `HUM +3`, `ADA +1` |

### VP07 – Ce tip de imagine ai pune pe perete?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | artă abstractă | `CRE +3`, `OBS +1` |
| B | portret uman | `EMP +2`, `STO +1` |
| C | arhitectură geometrică | `ANA +2`, `ORG +2` |
| D | peisaj natural | `OBS +2`, `AUT +1` |

### VP08 – Ce activitate ai alege?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | susținerea unei prezentări | `COM +2`, `SOC +2` |
| B | construirea unui obiect | `PRA +3`, `ANA +1` |
| C | negocierea unui acord | `PER +3`, `COM +1` |
| D | crearea unei identități vizuale | `CRE +3`, `OBS +1` |

### VP09 – Unde ai petrece o zi de probă?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | platou TV | `SOC +2`, `COM +1`, `ADA +1` |
| B | sediu de companie | `LED +1`, `ORG +2`, `COL +1` |
| C | clinică sau laborator | `ANA +2`, `OBS +1`, `VAL +1` |
| D | studio de creație | `CRE +3`, `AUT +1` |

### VP10 – Ce imagine seamănă cu ideea ta de succes?

| Opțiune | Imagine | Scoruri sugerate |
|---|---|---|
| A | program flexibil și călătorii | `AUT +3`, `ADA +1` |
| B | obiective financiare atinse | `PRA +2`, `INI +1`, `ORG +1` |
| C | ajutor oferit unei comunități | `VAL +3`, `EMP +1` |
| D | recunoaștere pe scenă | `SOC +2`, `COM +1`, `LED +1` |

### Reguli speciale pentru imaginile utilizate

- fiecare opțiune trebuie să aibă text alternativ pentru accesibilitate;
- ordinea A–D trebuie randomizată;
- nu se va presupune că o singură imagine exprimă întreaga personalitate;
- alegerile vizuale vor avea o pondere mai mică decât răspunsurile situaționale și textuale.

---

## Testul 3 – „Ce ai face dacă...?”

**ID test:** `situational_judgement`  
**Scop:** observarea reacțiilor în situații neașteptate.  
**Format:** text liber, 1–5 propoziții.

| ID | Întrebare | Dimensiuni principale |
|---|---|---|
| `SJ01` | Ești live la TV și uiți complet ce trebuia să spui. Ce faci? | `ADA`, `RES`, `COM`, `HUM` |
| `SJ02` | Coordonatorul spune că ideea ta este slabă, dar tu crezi că este foarte bună. Cum reacționezi? | `RES`, `PER`, `COL` |
| `SJ03` | Ai rămas blocat într-un lift cu liderul companiei în care visezi să lucrezi. Ce îi spui? | `COM`, `INI`, `SOC` |
| `SJ04` | Primești din greșeală 10.000 €. Care este primul lucru pe care îl faci? | `VAL`, `PRA`, `RES` |
| `SJ05` | Trebuie să conduci o echipă în care oamenii nu se înțeleg. Cum începi? | `LED`, `EMP`, `COL`, `ORG` |
| `SJ06` | Ai cinci minute să inventezi o reclamă pentru o lingură. Care este ideea? | `CRE`, `HUM`, `PER`, `STO` |
| `SJ07` | Un client nervos te acuză de o greșeală pe care nu ai făcut-o. Ce răspunzi? | `EMP`, `COM`, `RES` |
| `SJ08` | Explică internetul unei persoane din anul 1800. Cum îl descrii? | `COM`, `CRE`, `STO` |
| `SJ09` | Poți pune o singură întrebare unei persoane pe care o admiri profesional. Care este? | `OBS`, `VAL`, `INI` |
| `SJ10` | Primești o sarcină despre care nu știi nimic și ai termen până mâine. Ce faci? | `ORG`, `ANA`, `RES`, `INI` |

### Semnale urmărite

- calm și recuperare după eroare;
- solicitarea de informații înaintea unei decizii;
- capacitatea de a proteja relația fără a evita problema;
- inițiativă și plan concret;
- umor adecvat situației;
- asumarea responsabilității.

---

## Testul 4 – „Testul de replică”

**ID test:** `quick_reply`  
**Scop:** comunicare verbală, spontaneitate, umor și storytelling.  
**Format:** completarea propoziției, maximum 300 de caractere.

| ID | Completează replica | Dimensiuni principale |
|---|---|---|
| `QR01` | „Am întârziat pentru că...” | `HUM`, `CRE`, `ADA` |
| `QR02` | „Dacă viața mea ar fi un serial, episodul de azi s-ar numi...” | `STO`, `HUM`, `CRE` |
| `QR03` | „Cel mai prost produs pe care aș putea să-l vând foarte bine este...” | `PER`, `CRE`, `HUM` |
| `QR04` | „Dacă aș deveni cunoscut mâine, probabil ar fi pentru...” | `AUT`, `STO`, `VAL` |
| `QR05` | „Un extraterestru mă întreabă ce este TikTok. Îi spun...” | `COM`, `CRE`, `HUM` |
| `QR06` | „Coordonatorul mă întreabă de ce merit mai multă responsabilitate. Răspund...” | `PER`, `COM`, `LED` |
| `QR07` | „Am 15 secunde la televizor. Spun...” | `COM`, `SOC`, `VAL` |
| `QR08` | „Trebuie să explic unui copil de șapte ani ce este succesul. Îi spun...” | `EMP`, `COM`, `VAL` |
| `QR09` | „Cea mai bună reclamă pentru mine ar suna așa...” | `PER`, `AUT`, `STO` |
| `QR10` | „Dacă aș introduce o materie nouă în școli, aceasta ar fi... pentru că...” | `VAL`, `INI`, `CRE` |

### Reguli de analiză

- se evaluează adecvarea replicii, nu popularitatea tipului de umor;
- sarcasmul agresiv, insultele și conținutul discriminatoriu nu aduc puncte;
- vocabularul sofisticat nu este considerat automat comunicare mai bună;
- o replică memorabilă poate crește `HUM`, `STO` sau `PER`, în funcție de mecanismul folosit.

---

## Testul 5 – „Tu ce vezi aici?”

**ID test:** `visual_storytelling`  
**Scop:** observație, interpretare socială, imaginație și gândire divergentă.  
**Format:** imagine + text liber.

| ID | Imagine afișată | Întrebare | Dimensiuni principale |
|---|---|---|---|
| `VS01` | stație de metrou aglomerată | Care este primul lucru pe care îl observi? | `OBS`, `EMP` |
| `VS02` | birou foarte dezordonat | Ce crezi că s-a întâmplat aici? | `OBS`, `ANA`, `STO` |
| `VS03` | două persoane discutând | Despre ce crezi că vorbesc? | `EMP`, `STO`, `CRE` |
| `VS04` | clădire futuristă | Ce proiect sau business ai deschide aici? | `CRE`, `INI`, `PRA` |
| `VS05` | persoană singură într-o mulțime | Scrie povestea ei într-o propoziție. | `EMP`, `STO`, `OBS` |
| `VS06` | obiect futurist necunoscut | La ce ar putea fi folosit? | `CRE`, `PRA`, `ANA` |
| `VS07` | scenă goală | Ce eveniment ai organiza aici? | `ORG`, `CRE`, `LED` |
| `VS08` | reclamă vizuală fără text | Ce slogan i-ai pune? | `PER`, `COM`, `CRE` |
| `VS09` | fotografie abstractă | Dă-i un titlu. | `CRE`, `STO`, `OBS` |
| `VS10` | echipă într-o ședință | Cine pare să coordoneze discuția și ce indiciu ai folosit? | `OBS`, `ANA`, `LED` |

### Cerințe pentru setul vizual

- imaginile nu trebuie să indice un singur răspuns „corect”;
- personajele trebuie să fie diverse și prezentate echilibrat;
- întrebarea `VS10` trebuie evaluată după justificarea indiciului, nu după persoana aleasă;
- imaginile pot fi schimbate între sesiuni, dar trebuie păstrat același obiectiv psihologic.

---

## Testul 6 – „Cum gândește creierul tău?”

**ID test:** `thinking_style`  
**Scop:** explorarea stilului de decizie și rezolvare a problemelor.  
**Format:** text liber.

| ID | Întrebare | Dimensiuni principale |
|---|---|---|
| `TS01` | Ai o problemă importantă. Preferi să discuți cu cineva sau să o analizezi singur? Explică. | `AUT`, `COL`, `ANA` |
| `TS02` | Primești 20 de informații și doar cinci sunt importante. Cum le identifici? | `ANA`, `ORG`, `OBS` |
| `TS03` | Ce te convinge mai repede: o poveste sau niște cifre? De ce? | `STO`, `ANA`, `PER` |
| `TS04` | Două persoane competente îți dau sfaturi opuse. Cum alegi? | `ANA`, `AUT`, `RES` |
| `TS05` | Ce faci când instrucțiunile sunt neclare? | `INI`, `COM`, `ADA` |
| `TS06` | Cum ai verifica dacă o idee de business este bună fără să investești mulți bani? | `PRA`, `ANA`, `INI` |
| `TS07` | Preferi să îmbunătățești ceva existent sau să creezi ceva complet nou? De ce? | `CRE`, `PRA`, `ANA` |
| `TS08` | Ce întrebare ai pune înainte să accepți un job? | `VAL`, `ORG`, `AUT` |
| `TS09` | Dacă o regulă nu are sens, ce faci? Explică. | `VAL`, `INI`, `COL` |
| `TS10` | Când trebuie să iei rapid o decizie, pe ce te bazezi? | `ANA`, `ADA`, `RES` |

### Stiluri care pot rezulta

- analitic;
- strategic;
- experimental;
- intuitiv-creativ;
- colaborativ;
- practic-orientat spre acțiune.

Utilizatorul poate avea o combinație de două sau trei stiluri.

---

## Testul 7 – „Cine ești într-o echipă?”

**ID test:** `team_role`  
**Scop:** identificarea rolurilor preferate în colaborare.  
**Format:** text liber.

| ID | Întrebare | Dimensiuni principale |
|---|---|---|
| `TR01` | Grupul nu știe de unde să înceapă. Ce faci? | `LED`, `ORG`, `INI` |
| `TR02` | Două persoane se ceartă. Cum intervii? | `EMP`, `COL`, `COM` |
| `TR03` | Nimeni nu vrea să prezinte proiectul. Ce faci? | `SOC`, `COM`, `INI` |
| `TR04` | Ai o idee diferită de restul echipei. Cum o prezinți? | `PER`, `COL`, `COM` |
| `TR05` | Un coleg nu își termină partea. Cum gestionezi situația? | `LED`, `EMP`, `ORG` |
| `TR06` | Echipa primește un compliment. Ce spui? | `COL`, `EMP`, `LED` |
| `TR07` | Proiectul eșuează. Care este prima ta reacție? | `RES`, `ANA`, `COL` |
| `TR08` | Aveți cu 50% mai puțin timp decât era planificat. Ce schimbi? | `ORG`, `ADA`, `LED` |
| `TR09` | Vine un membru nou și timid. Cum îl integrezi? | `EMP`, `COL`, `COM` |
| `TR10` | Dacă ai alege un singur rol într-un proiect mare, ce responsabilitate ai vrea? | `AUT`, `LED`, `ORG`, `CRE` |

### Roluri de echipă posibile

| Rol | Pattern orientativ |
|---|---|
| Coordonator | `LED + ORG + COL` |
| Mediator | `EMP + COM + COL` |
| Creator | `CRE + INI + ADA` |
| Strateg | `ANA + ORG + LED` |
| Prezentator | `COM + SOC + STO` |
| Specialist | `ANA + AUT + OBS` |
| Implementator | `PRA + ORG + RES` |

---

## Testul 8 – „Vinde-mi imposibilul”

**ID test:** `sell_impossible`  
**Scop:** creativitate comercială, persuasiune, marketing și inițiativă antreprenorială.  
**Format:** text liber, recomandat maximum 500 de caractere.

| ID | Provocare | Dimensiuni principale |
|---|---|---|
| `SI01` | Vinde-mi un pix care nu scrie. | `PER`, `CRE`, `ADA` |
| `SI02` | Creează o reclamă pentru o vacanță pe Lună. | `STO`, `CRE`, `PER` |
| `SI03` | Convinge-mă să cumpăr o sticlă cu „aer premium”. | `HUM`, `PER`, `CRE` |
| `SI04` | Inventează un slogan pentru tine. | `COM`, `AUT`, `STO` |
| `SI05` | Transformă mersul la școală într-o experiență premium. | `CRE`, `PRA`, `VAL` |
| `SI06` | Convinge un adolescent să petreacă 24 de ore fără telefon. | `EMP`, `PER`, `COM` |
| `SI07` | Inventează un produs pentru o problemă pe care oamenii încă nu știu că o au. | `OBS`, `CRE`, `INI` |
| `SI08` | Ai 20 de secunde să promovezi orașul tău. Ce spui? | `COM`, `STO`, `PER` |
| `SI09` | Cum ai face viral un muzeu? | `CRE`, `INI`, `PRA` |
| `SI10` | Primești o cutie de carton. Creează-i o campanie memorabilă. | `CRE`, `HUM`, `STO`, `PER` |

### Criterii specifice

- identificarea unei nevoi sau a unui public;
- existența unui beneficiu, chiar dacă este ludic;
- claritatea mesajului;
- originalitate fără a încuraja înșelarea clientului;
- adaptarea tonului la produs și public.