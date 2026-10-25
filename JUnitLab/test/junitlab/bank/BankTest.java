package junitlab.bank;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import junitlab.bank.impl.GreatSavingsBank;

/**
 * A GreatSavingsBank implementacio tesztjei: szamlanyitas, egyenleg
 * lekerdezes es befizetes.
 */
class BankTest {

    /** A tesztelt bank peldany. Minden teszt elott ujra letrejon. */
    private Bank bank;

    @BeforeEach
    void setUp() {
        bank = new GreatSavingsBank();
    }

    @Test
    void testOpenAccount() throws AccountNotExistsException {
        String account = bank.openAccount();
        assertNotNull(account);
        assertEquals(0L, bank.getBalance(account));
    }

    @Test
    void testUniqueAccount() {
        String first = bank.openAccount();
        String second = bank.openAccount();
        assertNotEquals(first, second);
    }

    @Test
    void testInvalidAccount() {
        assertThrows(AccountNotExistsException.class,
                () -> bank.getBalance("nem-letezo-szamlaszam"));
    }

    @Test
    void testDeposit() throws AccountNotExistsException {
        String account = bank.openAccount();
        bank.deposit(account, 2000L);
        assertEquals(2000L, bank.getBalance(account));
    }
}
