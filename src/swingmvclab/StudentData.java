package swingmvclab;

import java.util.ArrayList;
import java.util.List;

import javax.swing.table.AbstractTableModel;

/*
 * A hallgatok adatait tarolo osztaly.
 *
 * Az AbstractTableModel osbosztalybol szarmazik, igy kozvetlenul hasznalhato
 * egy JTable adatmodelljekent.
 */
public class StudentData extends AbstractTableModel {

    private static final long serialVersionUID = 1L;

    /*
     * Ez a tagvaltozo tarolja a hallgatoi adatokat.
     * NE MODOSITSD!
     */
    List<Student> students = new ArrayList<Student>();

    // Az oszlopok fejlecei.
    private static final String[] COLUMN_NAMES = { "Nev", "Neptun", "Alairas", "Jegy" };

    // 2. feladat: az oszlopok szama (nev, neptun, alairas, jegy).
    @Override
    public int getColumnCount() {
        return COLUMN_NAMES.length;
    }

    // 2. feladat: a sorok szama (ahany hallgato van).
    @Override
    public int getRowCount() {
        return students.size();
    }

    // 2. feladat: az adott cella erteke.
    @Override
    public Object getValueAt(int rowIndex, int columnIndex) {
        Student student = students.get(rowIndex);
        switch (columnIndex) {
            case 0: return student.getName();
            case 1: return student.getNeptun();
            case 2: return student.hasSignature();
            default: return student.getGrade();
        }
    }

    // 3. feladat: az oszlopok fejleceinek szovege.
    @Override
    public String getColumnName(int column) {
        return COLUMN_NAMES[column];
    }

    // 3. feladat: az oszlopok adattipusa (a megfelelo megjelenitesert).
    @Override
    public Class<?> getColumnClass(int columnIndex) {
        switch (columnIndex) {
            case 0: return String.class;
            case 1: return String.class;
            case 2: return Boolean.class;
            default: return Integer.class;
        }
    }

    // 4. feladat: az Alairas (2) es Jegy (3) oszlop cellai szerkeszthetok.
    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return columnIndex == 2 || columnIndex == 3;
    }

    // 4. feladat: a felhasznaloi feluleten bevitt ertek eltarolasa.
    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
        Student student = students.get(rowIndex);
        switch (columnIndex) {
            case 2:
                student.setSignature((Boolean) aValue);
                break;
            case 3:
                student.setGrade((Integer) aValue);
                break;
            default:
                return;
        }
        fireTableCellUpdated(rowIndex, columnIndex);
    }

    // 5. feladat: uj hallgato felvetele az adatmodellbe.
    public void addStudent(String name, String neptun) {
        students.add(new Student(name, neptun, false, 0));
        // Ertesitjuk a tablazatot, hogy egy uj sor kerult a lista vegere.
        fireTableRowsInserted(students.size() - 1, students.size() - 1);
    }

}
