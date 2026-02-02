#include "account.h"

Account::Account(const QString idAccount,
                 const QString idOwner,
                 qint64 balance,
                 qint64 creditLimit,
                 QString accountType)
{
    this->idAccount = idAccount;
    this->idOwner = idOwner;
    this->balance = balance;
    this->creditLimit = creditLimit;
    this->accountType = accountType;
}

QString Account::getIdAccount() const
{
    return idAccount;
}

QString Account::getIdOwner() const
{
    return idOwner;
}

int Account::getBalance() const
{
    return balance;
}

void Account::setBalance(int newBalance)
{
    balance = newBalance;
}

int Account::getCreditLimit() const
{
    return creditLimit;
}

void Account::setCreditLimit(int newCreditLimit)
{
    creditLimit = newCreditLimit;
}

QString Account::getAccountType() const
{
    return accountType;
}
