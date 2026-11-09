package caesar;

import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

/**
 * A Caesar-kódoló alkalmazás fő ablaka.
 *
 * Megvalósítja a Java Swing labor 2-7. feladatait:
 *  - 2. JFrame alapbeállítások
 *  - 3. Elrendezés (BorderLayout + JPanelek, FlowLayout)
 *  - 4. Listener (OkButtonActionListener belső osztály)
 *  - 5. Adapter (InputFieldKeyListener - KeyAdapter, lásd a megjegyzést a hibáról)
 *  - 6. DocumentListener (a KeyListener helyett helyes megoldás)
 *  - 7. Kétirányú (de)kódolás FocusListenerrel
 */
public class CaesarFrame extends JFrame {

    private static final long serialVersionUID = 1L;

    /** A felső (bemeneti) szövegmező, 20 karakter széles. */
    private final JTextField inputField = new JTextField(20);

    /** Az alsó (kimeneti) szövegmező, 20 karakter széles. */
    private final JTextField outputField = new JTextField(20);

    /** A "Code!" gomb. */
    private final JButton codeButton = new JButton("Code!");

    /** A legördülő lista az eltolás-karakter kiválasztásához (A..Z). */
    private final JComboBox<Object> offsetComboBox;

    /**
     * Jelzi, hogy melyik mezőben szerkesztett utoljára a felhasználó (7. feladat).
     * true  -> a felső (bemeneti) mezőben -> kódolás
     * false -> az alsó (kimeneti) mezőben  -> dekódolás
     */
    private boolean inputFieldActive = true;

    /**
     * Jelzi, hogy épp mi magunk módosítjuk-e programból a mezőket.
     * Így a DocumentListener nem indít végtelen ciklust, amikor a másik mezőt frissítjük.
     */
    private boolean updating = false;

    public CaesarFrame() {
        // --- 2. feladat: alap JFrame-beállítások ---
        // X-re kattintva valóban lépjen ki az alkalmazás.
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        // Az ablak címsorának szövege.
        setTitle("SwingLab");

        // --- 3. feladat: a JComboBox feltöltése az angol ABC nagybetűivel ---
        Object[] letters = new Object[Caesar.ALPHABET_SIZE];
        for (int i = 0; i < Caesar.ALPHABET_SIZE; i++) {
            letters[i] = (char) ('A' + i);
        }
        offsetComboBox = new JComboBox<>(letters);

        // --- 3. feladat: elrendezés ---
        buildLayout();

        // --- 4. feladat: a gomb eseményfigyelője ---
        codeButton.addActionListener(new OkButtonActionListener());

        // --- 6. feladat: a bemeneti mező minden változására reagáló DocumentListener ---
        // (Az 5. feladat KeyListenere helyett ez a helyes megoldás - lásd lentebb.)
        inputField.getDocument().addDocumentListener(new FieldDocumentListener());

        // --- 7. feladat: FocusListenerrel követjük, melyik mezőben dolgozunk ---
        inputField.addFocusListener(new FieldFocusListener(true));
        outputField.addFocusListener(new FieldFocusListener(false));

        // --- 2. feladat: méret és átméretezhetőség ---
        // A 3. feladat végén kértük az átméretezhetőséget, ezért engedélyezzük.
        setSize(400, 110);
        setResizable(true);
    }

    /**
     * Felépíti a 3. feladat szerinti elrendezést.
     *
     * A JFrame tartalompanelje BorderLayout. Ebbe kerül egy felső JPanel
     * (JComboBox, bemeneti JTextField, Code! gomb) és egy alsó JPanel
     * (JLabel "Output:" és a kimeneti JTextField).
     */
    private void buildLayout() {
        setLayout(new BorderLayout());

        // Felső panel: alapértelmezett FlowLayout.
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        topPanel.add(offsetComboBox);
        topPanel.add(inputField);
        topPanel.add(codeButton);

        // Alsó panel: alapértelmezett FlowLayout, Output: felirattal.
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        bottomPanel.add(new JLabel("Output:"));
        bottomPanel.add(outputField);

        // A 3. feladatban az alsó mezőt nem szabad szerkeszteni...
        // ... de a 7. feladatban szerkeszthetővé tesszük a visszakódoláshoz.
        outputField.setEditable(true);

        add(topPanel, BorderLayout.NORTH);
        add(bottomPanel, BorderLayout.CENTER);
    }

    /** A JComboBoxban kiválasztott eltolás-karakter. */
    private char getSelectedOffset() {
        return (Character) offsetComboBox.getSelectedItem();
    }

    /**
     * Elvégzi a (de)kódolást az alapján, hogy melyik mezőben dolgozott utoljára
     * a felhasználó (7. feladat), és a megfelelő mezőbe írja az eredményt.
     */
    private void recode() {
        if (updating) {
            return;
        }
        updating = true;
        try {
            char offset = getSelectedOffset();
            if (inputFieldActive) {
                // Felülről lefelé: kódolás.
                outputField.setText(Caesar.caesarCode(inputField.getText(), offset));
            } else {
                // Alulról felfelé: dekódolás.
                inputField.setText(Caesar.caesarDecode(outputField.getText(), offset));
            }
        } finally {
            updating = false;
        }
    }

    // =====================================================================
    // 4. feladat: belső osztály az ActionListener interfész megvalósításához.
    // Belső (nem statikus) osztály, így eléri a befogadó CaesarFrame attribútumait.
    // =====================================================================
    private class OkButtonActionListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            recode();
        }
    }

    // =====================================================================
    // 5. feladat: KeyAdapterből származó KeyListener.
    //
    // MILYEN HIBÁT TAPASZTALUNK ÉS MI OKOZZA?
    // A keyPressed/keyReleased esemény akkor fut le, amikor a billentyűt
    // lenyomjuk, de a JTextField tartalma (Document modellje) ilyenkor még
    // NEM frissült az éppen leütött karakterrel. Így a kódolás mindig egy
    // karakterrel "lemaradva", a legutóbb beírt betű nélkül történik.
    // A helyes megoldás ezért a 6. feladat DocumentListenere, amely a modell
    // tényleges megváltozására reagál. Ezt az osztályt szándékosan nem
    // regisztráljuk a bemeneti mezőhöz; dokumentációs/összehasonlítási célú.
    // =====================================================================
    @SuppressWarnings("unused")
    private class InputFieldKeyListener extends KeyAdapter {
        @Override
        public void keyReleased(KeyEvent e) {
            // A hibás viselkedés miatt NEM használjuk (lásd a fenti megjegyzést).
            recode();
        }
    }

    // =====================================================================
    // 6. feladat: DocumentListener - a bemeneti mező modelljének változására
    // reagál, így a legutóbb beírt karakter is benne van a kódolandó szövegben.
    // =====================================================================
    private class FieldDocumentListener implements DocumentListener {
        @Override
        public void insertUpdate(DocumentEvent e) {
            recode();
        }

        @Override
        public void removeUpdate(DocumentEvent e) {
            recode();
        }

        @Override
        public void changedUpdate(DocumentEvent e) {
            recode();
        }
    }

    // =====================================================================
    // 7. feladat: FocusListener - megjegyzi, melyik mezőben dolgozunk épp,
    // így a Code! gomb a megfelelő irányba (de)kódol.
    // =====================================================================
    private class FieldFocusListener implements FocusListener {
        private final boolean isInputField;

        FieldFocusListener(boolean isInputField) {
            this.isInputField = isInputField;
        }

        @Override
        public void focusGained(FocusEvent e) {
            inputFieldActive = isInputField;
        }

        @Override
        public void focusLost(FocusEvent e) {
            // nincs teendő
        }
    }

    /**
     * Az alkalmazás belépési pontja: példányosítja és megjeleníti az ablakot.
     */
    public static void main(String[] args) {
        // A Swing komponenseket az Event Dispatch Threaden hozzuk létre.
        SwingUtilities.invokeLater(() -> {
            CaesarFrame frame = new CaesarFrame();
            frame.setVisible(true);
        });
    }
}
