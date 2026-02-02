#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <QString>


class Account
{
public:
    Account(const QString idAccount,
            const QString idOwner,
            qint64 balance,
            qint64 creditLimit,
            QString accountType);

    QString getIdAccount() const;

    QString getIdOwner() const;

    int getBalance() const;
    void setBalance(int newBalance);

    int getCreditLimit() const;
    void setCreditLimit(int newCreditLimit);

    QString getAccountType() const;

private:
    QString idAccount;
    QString idOwner;
    int balance; // Cents
    int creditLimit; // Cents
    QString accountType;
};

#endif // ACCOUNT_H
