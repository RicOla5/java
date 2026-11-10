package caesar;

import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

public class CaesarFrame extends JFrame {

    private static final long serialVersionUID = 1L;

    private final JTextField inputField = new JTextField(20);

    private final JTextField outputField = new JTextField(20);

    private final JButton codeButton = new JButton("Code!");

    private final JComboBox<Object> offsetComboBox;

    /*
     * 7. feladat.
     * true  -> kódolás
     * false -> dekódolás
     */
    private boolean inputFieldActive = true;


    private boolean updating = false;

    public CaesarFrame() {
        //  2. feladat: alap JFrame-beállítások 
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setTitle("SwingLab");

        // 3. feladat: JComboBox feltöltése 
        Object[] letters = new Object[Caesar.ALPHABET_SIZE];
        for (int i = 0; i < Caesar.ALPHABET_SIZE; i++) {
            letters[i] = (char) ('A' + i);
        }
        offsetComboBox = new JComboBox<>(letters);

        // 3. feladat: elrendezés 
        buildLayout();

        //  4. feladat: a gomb eseményfigyelője 
        codeButton.addActionListener(new OkButtonActionListener());

        //  6. feladat: a bemeneti mező változására reagáló DocumentListener
        inputField.getDocument().addDocumentListener(new FieldDocumentListener());

        //  7. feladat: FocusListenerrel követjük, melyik mezőben dolgozunk 
        inputField.addFocusListener(new FieldFocusListener(true));
        outputField.addFocusListener(new FieldFocusListener(false));

        //  2. feladat: méret és átméretezhetőség
        setSize(400, 110);
        setResizable(true);
    }

    // 3. feladat: a komponensek elrendezése a JFrame-ben
    private void buildLayout() {
        setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        topPanel.add(offsetComboBox);
        topPanel.add(inputField);
        topPanel.add(codeButton);

        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        bottomPanel.add(new JLabel("Output:"));
        bottomPanel.add(outputField);

        outputField.setEditable(true);

        add(topPanel, BorderLayout.NORTH);
        add(bottomPanel, BorderLayout.CENTER);
    }

    private char getSelectedOffset() {
        return (Character) offsetComboBox.getSelectedItem();
    }

    //a dekódolás/kódolás tényleges végrehajtása a bemeneti mező tartalmának megfelelően
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

    // 4. feladat: ActionListener megvalósítása.
    private class OkButtonActionListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            recode();
        }
    }

    // 6. feladat: DocumentListener - a bemeneti mező modelljének változására reagál
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

    // 7. feladat: FocusListener - megjegyzi, melyik mezőben dolgozunk épp,
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
            // nincs teendő (placeholder)
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            CaesarFrame frame = new CaesarFrame();
            frame.setVisible(true);
        });
    }
}
