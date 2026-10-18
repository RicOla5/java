package lambeer;

import java.util.Scanner;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class Main {

    static ArrayList<Beer> beers = new ArrayList<Beer>();

    protected static void add(String[] cmd) {
        beers.add(new Beer(cmd[1], cmd[2], Double.parseDouble(cmd[3])));
    }

    protected static void list(String[] cmd) {
        if (cmd.length > 1) {
            if ("name".equals(cmd[1])) {
                Collections.sort(beers,
                        (b1, b2) -> b1.getName().compareTo(b2.getName())
                );
            } else if ("style".equals(cmd[1])) {
                Collections.sort(beers,
                        (b1, b2) -> b1.getStyle().compareTo(b2.getStyle())
                );
            } else if ("strength".equals(cmd[1])) {
                Collections.sort(beers,
                        (b1, b2) -> Double.compare(b1.getStrength(), b2.getStrength())
                );
            }
        }
        for (Beer b : beers) {
            System.out.println(b);
        }
    }

    protected static void save(String[] cmd) {
        try {
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(cmd[1]));
            out.writeObject(beers);
            out.close();
        } catch (Exception e) {
            System.out.println("Error saving to file.");
        }
    }

    @SuppressWarnings("unchecked")
    protected static void load(String[] cmd) {
        try {
            ObjectInputStream in = new ObjectInputStream(new FileInputStream(cmd[1]));
            beers = (ArrayList<Beer>) in.readObject();
            in.close();
        } catch (Exception e) {
            System.out.println("Error loading from file.");
        }
    }

    protected static void search(String[] cmd) {
        String field = cmd[1];
        String value = cmd[2];
        for (Beer b : beers) {
            if ("name".equals(field) && b.getName().equals(value)) {
                System.out.println(b);
            } else if ("style".equals(field) && b.getStyle().equals(value)) {
                System.out.println(b);
            } else if ("strength".equals(field) && b.getStrength() == Double.parseDouble(value)) {
                System.out.println(b);
            }
        }
    }

    protected static void find(String[] cmd) {
        String field = cmd[1];
        String value = cmd[2];
        for (Beer b : beers) {
            if ("name".equals(field) && b.getName().contains(value)) {
                System.out.println(b);
            } else if ("style".equals(field) && b.getStyle().contains(value)) {
                System.out.println(b);
            } else if ("strength".equals(field) && b.getStrength() >= Double.parseDouble(value)) {
                System.out.println(b);
            } else if ("weaker".equals(field) && b.getStrength() <= Double.parseDouble(value)) {
                System.out.println(b);
            }
        }
    }

    protected static void delete(String[] cmd) {
        Iterator<Beer> it = beers.iterator();
        while (it.hasNext()) {
            Beer b = it.next();
            if (b.getName().equals(cmd[1])) {
                it.remove();
            }
        }
    }

    public static void main(String[] args) {
        Map<String, Command> commands = new HashMap<String, Command>();
        commands.put("add", Main::add);
        commands.put("list", Main::list);
        commands.put("save", Main::save);
        commands.put("load", Main::load);
        commands.put("search", Main::search);
        commands.put("find", Main::find);
        commands.put("delete", Main::delete);

        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Enter the command: ");
            String[] cmd = scanner.nextLine().split(" ");
            if ("exit".equals(cmd[0])) {
                break;
            }
            Command command = commands.get(cmd[0]);
            if (command != null) {
                command.execute(cmd);
            } else {
                System.out.println("Unknown command.");
            }
        }
        scanner.close();
    }
}
