package swingmvclab;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;

/*
 * A megjelen�tend� ablakunk oszt�lya.
 */
public class StudentFrame extends JFrame {
    
    /*
     * Ebben az objektumban vannak a hallgat�i adatok.
     * A program indul�s ut�n bet�lti az adatokat f�jlb�l, bez�r�skor pedig kimenti oda.
     * 
     * NE M�DOS�TSD!
     */
    private StudentData data;

    // 5. feladat: beviteli mezok az uj hallgato nevehez es neptunkodjahoz.
    private JTextField nameField;
    private JTextField neptunField;

    /*
     * Itt hozzuk letre es adjuk hozza az ablakunkhoz a kulonbozo komponenseket
     * (tablazat, beviteli mezo, gomb).
     */
    private void initComponents() {
        this.setLayout(new BorderLayout());

        // 2. feladat: tablazat letrehozasa a data adatmodellel, gorditheto panelben.
        JTable table = new JTable(data);
        table.setFillsViewportHeight(true);
        JScrollPane scrollPane = new JScrollPane(table);
        this.add(scrollPane, BorderLayout.CENTER);

        // 5. feladat: also panel az uj hallgato felvetelehez.
        JPanel inputPanel = new JPanel();

        inputPanel.add(new JLabel("Nev:"));
        nameField = new JTextField(20);
        inputPanel.add(nameField);

        inputPanel.add(new JLabel("Neptun:"));
        neptunField = new JTextField(6);
        inputPanel.add(neptunField);

        JButton addButton = new JButton("Felvesz");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                data.addStudent(nameField.getText(), neptunField.getText());
            }
        });
        inputPanel.add(addButton);

        this.add(inputPanel, BorderLayout.SOUTH);
    }

    /*
     * Az ablak konstruktora.
     * 
     * NE M�DOS�TSD!
     */
    @SuppressWarnings("unchecked")
    public StudentFrame() {
        super("Hallgat�i nyilv�ntart�s");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        
        // Indul�skor bet�ltj�k az adatokat
        try {
            data = new StudentData();
            ObjectInputStream ois = new ObjectInputStream(new FileInputStream("students.dat"));
            data.students = (List<Student>)ois.readObject();
            ois.close();
        } catch(Exception ex) {
            ex.printStackTrace();
        }
        
        // Bez�r�skor mentj�k az adatokat
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                try {
                    ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("students.dat"));
                    oos.writeObject(data.students);
                    oos.close();
                } catch(Exception ex) {
                    ex.printStackTrace();
                }
            }
        });

        // Fel�p�tj�k az ablakot
        setMinimumSize(new Dimension(500, 200));
        initComponents();
    }

    /*
     * A program bel�p�si pontja.
     * 
     * NE M�DOS�TSD!
     */
    public static void main(String[] args) {
        // Megjelen�tj�k az ablakot
        StudentFrame sf = new StudentFrame();
        sf.setVisible(true);
    }
}
