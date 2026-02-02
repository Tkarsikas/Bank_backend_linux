#include "accountview.h"
#include "ui_accountview.h"

accountview::accountview(Account &newAccount, QWidget *parent)
    : QDialog(parent)
    , ui(new Ui::accountview)
    , account(newAccount)
{
    ui->setupUi(this);
    connect(ui->btnTestButton, &QPushButton::clicked, this, &accountview::btnTestButtonSlot);
}

accountview::~accountview()
{
    delete ui;
}

void accountview::btnTestButtonSlot()
{
    qDebug() << "Account ID:" << account.getIdAccount();
    qDebug() << "Owner ID:" << account.getIdOwner();
    qDebug() << "Balance:" << account.getBalance();
    qDebug() << "Credit limit:" << account.getCreditLimit();
    qDebug() << "Type:" << account.getAccountType();
}
