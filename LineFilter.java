import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.Scanner;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class LineFilter {
    public static void main(String[] args) {
        String input = null;
        String output = null;
        String pattern = "";
        boolean gzipInput = false;
        boolean gzipOutput = false;

        for (int i = 0; i < args.length; i++) {
            if (args[i].equals("-gi")) {
                gzipInput = true;
            } else if (args[i].equals("-go")) {
                gzipOutput = true;
            } else if ((i + 1 < args.length) && args[i].equals("-i")) {
                i++;
                input = args[i];
            } else if ((i + 1 < args.length) && args[i].equals("-o")) {
                i++;
                output = args[i];
            } else if ((i + 1 < args.length) && args[i].equals("-p")) {
                i++;
                pattern = args[i];
            }
        }

        Scanner scanner = null;
        PrintStream out = null;

        try {
            if (input != null) {
                File inputFile = new File(input);
                if (!inputFile.exists() || !inputFile.isFile()) {
                    System.err.println("Hiba: A megadott bemeneti fájl nem létezik: " + input);
                    return;
                }

                InputStream inStream = new FileInputStream(inputFile);
                if (gzipInput) {
                    inStream = new GZIPInputStream(inStream);
                }
                scanner = new Scanner(inStream);
            } else {
                scanner = new Scanner(System.in);
            }

            if (output != null) {
                OutputStream outStream = new FileOutputStream(output);
                if (gzipOutput) {
                    outStream = new GZIPOutputStream(outStream);
                }
                out = new PrintStream(outStream);
            } else {
                out = System.out;
            }

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if (line.matches(pattern)) {
                    out.println(line);
                }
            }

        } catch (IOException e) {
            System.err.println("I/O hiba történt a fájlkezelés során: " + e.getMessage());
        } 
        if (scanner != null) {
                scanner.close();
        }
        if (output != null && out != null) {
                out.close();
        }
    }
}