#include "noaccountsview.h"
#include "ui_noaccountsview.h"

noaccountsview::noaccountsview(QWidget *parent)
    : QDialog(parent)
    , ui(new Ui::noaccountsview)
{
    ui->setupUi(this);
}

noaccountsview::~noaccountsview()
{
    delete ui;
}
