#ifndef CARDSELECTIONDIALOG_H
#define CARDSELECTIONDIALOG_H

#include <QDialog>
#include <qjsonarray.h>
#include <qjsonobject.h>
#include "account.h"
#include "accountview.h"

namespace Ui {
class cardselectiondialog;
}

class cardselectiondialog : public QDialog
{
    Q_OBJECT

public:
    explicit cardselectiondialog(
        QVector<Account> accounts,
        QWidget *parent = nullptr);
    ~cardselectiondialog();

private:
    Ui::cardselectiondialog *ui;
    QVector<Account> accounts;

private slots:
    void btnCreditAccount();
    void btnDebitAccount();
};

#endif // CARDSELECTIONDIALOG_H
