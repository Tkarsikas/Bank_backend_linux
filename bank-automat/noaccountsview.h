#ifndef NOACCOUNTSVIEW_H
#define NOACCOUNTSVIEW_H

#include <QDialog>

namespace Ui {
class noaccountsview;
}

class noaccountsview : public QDialog
{
    Q_OBJECT

public:
    explicit noaccountsview(QWidget *parent = nullptr);
    ~noaccountsview();

private:
    Ui::noaccountsview *ui;
};

#endif // NOACCOUNTSVIEW_H
