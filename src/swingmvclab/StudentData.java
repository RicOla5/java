package swingmvclab;

import java.util.ArrayList;
import java.util.List;

import javax.swing.table.AbstractTableModel;

/*
 * A hallgatók adatait tároló osztály.
 *
 * Az AbstractTableModel ősosztályból származik, így közvetlenül használható
 * egy JTable adatmodelljeként.
 */
public class StudentData extends AbstractTableModel {

    private static final long serialVersionUID = 1L;

    /*
     * Ez a tagváltozó tárolja a hallgatói adatokat.
     * NE MÓDOSÍTSD!
     */
    List<Student> students = new ArrayList<Student>();

    // Az oszlopok fejlécei.
    private static final String[] COLUMN_NAMES = { "Név", "Neptun", "Aláírás", "Jegy" };

    // 2. feladat: az oszlopok száma (név, neptun, aláírás, jegy).
    @Override
    public int getColumnCount() {
        return COLUMN_NAMES.length;
    }

    // 2. feladat: a sorok száma (ahány hallgató van).
    @Override
    public int getRowCount() {
        return students.size();
    }

    // 2. feladat: az adott cella értéke.
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

    // 3. feladat: az oszlopok fejlécének szövege.
    @Override
    public String getColumnName(int column) {
        return COLUMN_NAMES[column];
    }

    // 3. feladat: az oszlopok adattípusa (a megfelelő megjelenítésért).
    @Override
    public Class<?> getColumnClass(int columnIndex) {
        switch (columnIndex) {
            case 0: return String.class;
            case 1: return String.class;
            case 2: return Boolean.class;
            default: return Integer.class;
        }
    }

    // 4. feladat: az Aláírás (2) és a Jegy (3) oszlop cellái szerkeszthetők.
    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex) {
        return columnIndex == 2 || columnIndex == 3;
    }

    // 4. feladat: a felhasználói felületen bevitt érték eltárolása.
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

    // 5. feladat: új hallgató felvétele az adatmodellbe.
    public void addStudent(String name, String neptun) {
        students.add(new Student(name, neptun, false, 0));
        // Értesítjük a táblázatot, hogy egy új sor került a lista végére.
        fireTableRowsInserted(students.size() - 1, students.size() - 1);
    }

}
