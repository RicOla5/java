// ===================================================================
//  Java Prog 6. KisZH – kérdésadatbázis (SWING GUI)
//  Témák: JFrame, JButton, JTextField, ActionListener, eseménykezelés
//  Típusok:
//    - "truefalse"  : Igaz/Hamis   (answer: true|false)
//    - "single"     : feleletválasztós, 1 helyes (options[], answer: index)
//    - "text"       : kódot/választ kell írni (answer: minta-megoldás(ok))
// ===================================================================

const QUESTIONS = [
  // ---------------------------------------------------------------
  //  SWING – Igaz/Hamis
  // ---------------------------------------------------------------
  { topic: "Swing", type: "truefalse",
    q: "Swing Container-be helyezhető másik Swing Container is.",
    answer: true,
    explain: "Igaz. A Swing konténerek egymásba ágyazhatók (pl. egy JPanel egy másik JPanelbe), így épül fel a komponens-hierarchia." },

  { topic: "Swing", type: "truefalse",
    q: "Futási idejű hibát kapunk, ha egy Swing Container-ben nincs elem.",
    answer: false,
    explain: "Hamis. Egy üres konténer teljesen érvényes – csak nem jelenít meg semmit, de nem dob hibát." },

  { topic: "Swing", type: "truefalse",
    q: "Nem kapunk futási idejű hibát, ha egy Swing Container-ben nincs elem.",
    answer: true,
    explain: "Igaz. Az üres konténer megengedett, nem okoz futási hibát. (Ugyanaz, mint az előző állítás, csak fordított megfogalmazásban.)" },

  { topic: "Swing", type: "truefalse",
    q: "Ugyanahhoz a JButton objektumhoz csak egy ActionListener rendelhető hozzá.",
    answer: false,
    explain: "Hamis. Egy JButton-höz TÖBB ActionListener is hozzáadható (addActionListener többször is hívható); mindegyik értesítést kap a gombnyomáskor." },

  { topic: "Swing", type: "truefalse",
    q: "Ugyanaz az ActionListener nem rendelhető hozzá különböző JButton objektumokhoz.",
    answer: false,
    explain: "Hamis. UGYANAZ az ActionListener példány több különböző gombhoz is hozzáadható. Az actionPerformed-ban az ActionEvent getSource()-ával lehet megkülönböztetni, melyik gomb szólt." },

  { topic: "Swing", type: "truefalse",
    q: "Egy JButton-höz több ActionListener is hozzáadható.",
    answer: true,
    explain: "Igaz. Az addActionListener többször hívható; minden regisztrált listener megkapja az eseményt." },

  // ---------------------------------------------------------------
  //  SWING – fogalmak (single)
  // ---------------------------------------------------------------
  { topic: "Swing", type: "single",
    q: "Melyik metódussal regisztrálunk eseményfigyelőt egy JButton-höz?",
    options: ["addListener(l)", "addActionListener(l)", "setActionListener(l)", "onClick(l)"],
    answer: 1,
    explain: "A JButton.addActionListener(ActionListener l) metódussal adunk hozzá eseményfigyelőt." },

  { topic: "Swing", type: "single",
    q: "Az ActionListener interfész melyik metódusát kell megvalósítani?",
    options: ["public void onAction(ActionEvent e)", "public void actionPerformed(ActionEvent e)", "public void handle(ActionEvent e)", "public void run()"],
    answer: 1,
    explain: "Az ActionListener egyetlen absztrakt metódusa: void actionPerformed(ActionEvent e)." },

  { topic: "Swing", type: "single",
    q: "Az actionPerformed(ActionEvent e)-ben hogyan kapjuk meg, melyik komponens váltotta ki az eseményt?",
    options: ["e.getComponent()", "e.getSource()", "e.getButton()", "e.getTarget()"],
    answer: 1,
    explain: "Az ActionEvent.getSource() adja vissza az eseményt kiváltó komponens referenciáját (Object típusban, ezért gyakran kell castolni)." },

  { topic: "Swing", type: "single",
    q: "Hogyan jelenítünk meg egy JFrame ablakot a képernyőn?",
    options: ["frame.show(true)", "frame.setVisible(true)", "frame.display()", "frame.open()"],
    answer: 1,
    explain: "A JFrame.setVisible(true) jeleníti meg az ablakot. (A pack() előtte a komponensek méretéhez igazítja az ablakot.)" },

  { topic: "Swing", type: "single",
    q: "A JTextField tartalmát hogyan olvassuk ki / írjuk be?",
    options: ["getValue() / setValue()", "getText() / setText()", "read() / write()", "getContent() / setContent()"],
    answer: 1,
    explain: "A JTextField.getText() olvassa ki, a setText(String) írja be a szöveget." },

  { topic: "Swing", type: "single",
    q: "A BorderLayout melyik konstansai léteznek elrendezéshez?",
    options: ["TOP, BOTTOM, LEFT, RIGHT, MIDDLE", "NORTH, SOUTH, EAST, WEST, CENTER", "UP, DOWN, START, END", "N, S, E, W, C"],
    answer: 1,
    explain: "BorderLayout.NORTH, SOUTH, EAST, WEST, CENTER az öt pozíció." },

  // ---------------------------------------------------------------
  //  SWING – kódfeladatok (text)
  // ---------------------------------------------------------------
  { topic: "Swing kód", type: "text",
    q: "Az alábbi kódrészletben a kommentekben jelölt helyek kitöltésével készítsen Java alkalmazást! A cél egy olyan minimális, de teljes Java Swing alkalmazás készítése, amely egy ablakban alul (south) megjelenít egy szövegmezőt, bal oldalon (west) egy gombot. Ha a gombra klikkelünk, akkor a szabványos kimenetre íródjon ki a szövegmező tartalma. Feltételezheti, hogy a feladat megoldásához szükséges osztályok importálva vannak. A fentieken túl további komponenseket és konténereket ne vegyen fel.",
    answer: [
      "public class FirstFrame extends JFrame\n        implements ⟦ActionListener⟧ {\n\n    JButton gomb;\n    ⟦JTextField f;⟧\n\n    ⟦public void actionPerformed(ActionEvent ae) {\n        System.out.println(f.getText());\n    }⟧\n\n    public FirstFrame() {\n        super(\"L1 ZH\");\n        gomb = new JButton(\"Katt!\");\n        gomb.addActionListener(this);\n        ⟦f = new JTextField();\n        add(f, BorderLayout.SOUTH);\n        add(gomb, BorderLayout.WEST);\n        pack();⟧\n    }\n\n    public static void main(String[] args) {\n        JFrame jf = new FirstFrame();\n        jf.setVisible(true);\n    }\n}"
    ],
    explain: "Kitöltendő: 'implements ActionListener'; az actionPerformed-ban 'f.getText()' kiírása; a konstruktorban 'gomb.addActionListener(this)', a komponensek hozzáadása (f → SOUTH, gomb → WEST) és 'pack()'. A 'this' a listener, mert az osztály implementálja az ActionListener-t." },

  { topic: "Swing kód", type: "text",
    q: "Az alábbi kódrészletben a kommentekben jelölt helyek kitöltésével készítsen minél egyszerűbb Java alkalmazást, amely egy ablakban megjelenít egy TextField-et. Ha a textfielden entert ütünk, akkor a program kisbetűsítse a textfieldben lévő szöveget!\n\nAPI segítség:\n- ActionEvent: Object getSource() — visszatér az érintett komponens (widget) referenciájával\n- String: String toLowerCase() — visszatér egy olyan stringgel, amiben minden betű kisbetű.\n\nFeltételezheti, hogy a feladat megoldásához szükséges osztályok importálva vannak. A fentieken túl további komponenseket és konténereket ne vegyen fel. Lambda-kifejezést ne használjon.",
    answer: [
      "public class Tuesday extends JFrame {\n    public Tuesday() {\n        ActionListener listener = new TueActionListener();\n        JTextField what = new JTextField(10);\n        ⟦what.addActionListener(listener);⟧\n        this.add(what);\n        this.pack();\n    }\n    public static void main(String[] args) {\n        JFrame f = new Tuesday();\n        f.setVisible(true);\n    }\n}\n\nclass TueActionListener implements ActionListener {\n    public void actionPerformed(ActionEvent event) {\n        ⟦JTextField f = (JTextField) event.getSource();⟧\n        ⟦String h = f.getText();⟧\n        ⟦h = h.toLowerCase();⟧\n        ⟦f.setText(h);⟧\n    }\n}"
    ],
    explain: "Külön osztály (TueActionListener) implementálja az ActionListener-t. A JTextField-hez addActionListener-rel adjuk hozzá → enter leütésekor hívódik az actionPerformed. Ott getSource()-szal megkapjuk a mezőt (JTextField-re castolva), getText()-tel a szöveget, toLowerCase()-szel kisbetűsítjük, setText()-tel visszaírjuk." },

  { topic: "Swing kód", type: "text",
    q: "Az alábbi kódrészletben a kommentekben jelölt helyek kitöltésével készítsen minél egyszerűbb Java alkalmazást, amely egy ablakban felül (north) megjelenít egy szövegmezőt, alul (south) egy gombot ('Change' felirattal).\n\nHa a gombot megnyomjuk, akkor\n- ha a szövegmező nem szerkeszthető, szerkeszthetővé teszi,\n- ha szerkeszthető, akkor letiltja a szerkesztését.\n\nTipp: a JTextField rendelkezik setEditable és isEditable nevű metódusokkal. Feltételezheti, hogy a feladat megoldásához szükséges osztályok importálva vannak. A fentieken túl további komponenseket és konténereket ne vegyen fel.",
    answer: [
      "public class MainFrame extends JFrame ⟦implements ActionListener⟧ {\n    protected JTextField field;\n\n    @Override\n    public void actionPerformed(ActionEvent ae) {\n        ⟦if (field.isEditable()) {\n            field.setEditable(false);\n        } else {\n            field.setEditable(true);\n        }⟧\n    }\n\n    public MainFrame() {\n        field = new JTextField();\n        ⟦add(field, BorderLayout.NORTH);⟧\n        JButton gomb = new JButton(\"Change\");\n        ⟦add(gomb, BorderLayout.SOUTH);⟧\n        ⟦gomb.addActionListener(this);⟧\n        pack();\n    }\n\n    public static void main(String[] args) {\n        JFrame jf = new MainFrame();\n        jf.setVisible(true);\n    }\n}"
    ],
    explain: "Az actionPerformed az isEditable() alapján VÁLTOGAT: ha szerkeszthető → setEditable(false), különben setEditable(true). A konstruktorban a mező NORTH-ra, a 'Change' gomb SOUTH-ra kerül, és a gombhoz addActionListener(this). (Az osztály maga a listener.)" },
];

// Elérhető témakörök (a szűrőhöz)
const TOPICS = ["Swing", "Swing kód"];
