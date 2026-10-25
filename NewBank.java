package junitlab.bank;

public class NewBank {

	private final Bank delegate;

	public NewBank(final Bank delegate) {
		this.delegate = delegate;
	}

	public String openAccountAndDeposit(final long amount) throws AccountNotExistsException {
		final String accountNumber = delegate.openAccount();
		delegate.deposit(accountNumber, amount);
		return accountNumber;
	}

	public boolean transferAllAndCloseSourceAccount(final String sourceAccount, final String targetAccount)
			throws AccountNotExistsException, NotEnoughFundsException {
		final long balance = delegate.getBalance(sourceAccount);
		delegate.transfer(sourceAccount, targetAccount, balance);
		final boolean closed = delegate.closeAccount(sourceAccount);
		return closed;
	}

}
