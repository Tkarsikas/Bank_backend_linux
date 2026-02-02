#include "cardselectiondialog.h"
#include "ui_cardselectiondialog.h"

cardselectiondialog::cardselectiondialog(QVector<Account> accounts, QWidget *parent)
    : QDialog(parent)
    , ui(new Ui::cardselectiondialog)
{
    ui->setupUi(this);
    this->accounts = accounts;
    connect(ui->btnChooseCredit, &QPushButton::clicked, this, &cardselectiondialog::btnCreditAccount);
    connect(ui->btnChooseDebit, &QPushButton::clicked, this, &cardselectiondialog::btnDebitAccount);
}

cardselectiondialog::~cardselectiondialog()
{
    delete ui;
}

void cardselectiondialog::btnCreditAccount()
{
    for (int i = 0; i < accounts.size(); ++i) {
        Account acc = accounts[i];
        if(acc.getAccountType() == "CREDIT") {
            accountview *objAccountView = new accountview(acc,this);
            objAccountView->show();
            return;
        }
    }
}

void cardselectiondialog::btnDebitAccount()
{
    for (int i = 0; i < accounts.size(); ++i) {
        Account acc = accounts[i];
        if(acc.getAccountType() == "DEBIT") {
            accountview *objAccountView = new accountview(acc,this);
            objAccountView->show();
            return;
        }
    }
}
