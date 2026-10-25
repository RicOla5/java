package junitlab.bank;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

// import junitlab.bank.impl.FirstNationalBank;
import junitlab.bank.impl.GreatSavingsBank;

/**
 * A bank kerekitesi algoritmusanak parameteres tesztelese a penzfelvetel
 * (withdraw) muvelet soran.
 */
class BankParamTest {

    /**
     * Az adatsorokat elloallito statikus fuggveny: a kerekitetlen osszegek,
     * es a hozzajuk tartozo helyesen (100-ra) kerekitett ertekek parjai.
     */
    static Stream<Arguments> amounts() {
        return Stream.of(
                Arguments.of(1100L, 1100L),
                Arguments.of(1101L, 1100L),
                Arguments.of(1149L, 1100L),
                Arguments.of(1150L, 1200L),
                Arguments.of(1151L, 1200L),
                Arguments.of(1199L, 1200L),
                Arguments.of(1200L, 1200L));
    }

    @ParameterizedTest
    @MethodSource("amounts")
    void testWithdrawRounding(long amount, long rounded)
            throws AccountNotExistsException, NotEnoughFundsException {
        // A tesztelt bank. A ket futtatas kozott ezt az egy sort kell atallitani:
        // Bank bank = new FirstNationalBank();
        Bank bank = new GreatSavingsBank();

        String account = bank.openAccount();
        bank.deposit(account, 10000L);

        bank.withdraw(account, amount);

        assertEquals(10000L - rounded, bank.getBalance(account));
    }
}
