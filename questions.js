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
    q: "Készíts JFrame-leszármazott osztályt, amely ActionListener is. A konstruktorban: super(\"...\"), egy JButton (gomb), amihez EZT az objektumot (this) adod ActionListener-ként, és egy számláló mező (int nyomas). Az actionPerformed írja ki a számláló aktuális értékét. Töltsd ki a kommentben jelölt helyeket!",
    answer: [
      "public class FirstFrame extends JFrame implements ActionListener {\n    static int nyomas = 0;\n    JButton gomb;\n\n    @Override\n    public void actionPerformed(ActionEvent e) {\n        System.out.println(nyomas++);\n    }\n\n    public FirstFrame() {\n        super(\"Prog 2x\");\n        gomb = new JButton(\"Katt!\");\n        gomb.addActionListener(this);\n        this.add(gomb, BorderLayout.SOUTH);\n    }\n\n    public static void main(String[] args) {\n        JFrame jf = new FirstFrame();\n        jf.setVisible(true);\n    }\n}"
    ],
    explain: "A kitöltendő helyek: (1) 'implements ActionListener' az osztályfejben, (2) 'gomb.addActionListener(this)' a konstruktorban (mert az osztály maga a listener → this), (3) az actionPerformed felülírása @Override-dal. FIGYELEM: a gombot a KONSTRUKTORBAN kell hozzáadni (this.add(gomb, ...)), nem a main-ben – a main-ben a 'gomb' instance mezőre nem lehet statikus kontextusból hivatkozni." },

  { topic: "Swing kód", type: "text",
    q: "Írj Swing alkalmazást: egy ablakban egy JTextField; ha a mezőben entert ütünk, a program kisbetűsítse a benne lévő szöveget. Segítség: ActionEvent.getSource() a komponens referenciája; String.toLowerCase() a kisbetűs változat. Ne használj lambdát, ne módosítsd a meglévő kódot (külön listener osztály).",
    answer: [
      "class Tuesday extends JFrame {\n    public Tuesday() {\n        super(\"Prog3 ZH\");\n        ActionListener listener = new TueActionListener();\n        JTextField what = new JTextField(10);\n        what.addActionListener(listener);\n        this.add(what);\n        this.pack();\n    }\n    public static void main(String[] args) {\n        JFrame frame = new Tuesday();\n        frame.setVisible(true);\n    }\n}\n\nclass TueActionListener implements ActionListener {\n    @Override\n    public void actionPerformed(ActionEvent ae) {\n        JTextField field = (JTextField) ae.getSource();\n        String cucc = field.getText();\n        cucc = cucc.toLowerCase();\n        field.setText(cucc);\n    }\n}"
    ],
    explain: "Egy külön osztály implementálja az ActionListener-t. A JTextField-hez addActionListener-rel adjuk hozzá → enter leütésekor hívódik az actionPerformed. Ott getSource()-szal megkapjuk a mezőt (JTextField-re castolva), getText()-tel a szöveget, toLowerCase()-szel kisbetűsítjük, setText()-tel visszaírjuk." },
];

// Elérhető témakörök (a szűrőhöz)
const TOPICS = ["Swing", "Swing kód"];
