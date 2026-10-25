package junitlab.bank;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import junitlab.bank.impl.GreatSavingsBank;

/**
 * A GreatSavingsBank atutalas (transfer) muveletenek tesztjei elokeszitett
 * szamlakkal (text fixture).
 */
class BankTestFixture {

    /** A tesztelt bank peldany. */
    private Bank bank;

    /** Az elso szamla szamlaszama (kezdetben 1500 forint). */
    private String firstAccount;

    /** A masodik szamla szamlaszama (kezdetben 12000 forint). */
    private String secondAccount;

    @BeforeEach
    void setUp() throws AccountNotExistsException {
        bank = new GreatSavingsBank();

        firstAccount = bank.openAccount();
        bank.deposit(firstAccount, 1500L);

        secondAccount = bank.openAccount();
        bank.deposit(secondAccount, 12000L);
    }

    @Test
    void testTransfer() throws AccountNotExistsException, NotEnoughFundsException {
        bank.transfer(secondAccount, firstAccount, 3456L);

        assertEquals(4956L, bank.getBalance(firstAccount));
        assertEquals(8544L, bank.getBalance(secondAccount));
    }

    @Test
    void testTransferWithoutEnoughFunds() {
        assertThrows(NotEnoughFundsException.class,
                () -> bank.transfer(firstAccount, secondAccount, 3456L));
    }
}
