#include "mainwindow.h"
#include "./ui_mainwindow.h"


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->btnLogin, &QPushButton::clicked, this, &MainWindow::btnLoginSlot);
    manager = new QNetworkAccessManager(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::btnLoginSlot()
{
    // Set request url and header
    QString url = environment::base_url() + "api/login";
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    // Create object, where to insert idcard and pin
    QJsonObject loginObject;
    loginObject.insert("idcard", ui->textCardId->text());
    loginObject.insert("pin", ui->textPin->text());

    // Clear line edits
    ui->textCardId->clear();
    ui->textPin->clear();

    // Create QJsonDocument and post request
    QJsonDocument jsonLoginDoc(loginObject);
    reply= manager->post(request, jsonLoginDoc.toJson());
    connect(reply, &QNetworkReply::finished, this, &MainWindow::loginActionSlot);
}

void MainWindow::loginActionSlot()
{
    QByteArray responseData = reply->readAll();

    // Check are backend up
    if (reply->error() != QNetworkReply::NoError) {
        qDebug()<< "Tarkista backend";
        ui->labelInfo->setText("Yhteysvirhe");
        ui->labelInfo->show();

        //Timer for labelInfo
        QTimer::singleShot(4000, this, [this]() {
            ui->labelInfo->clear();
        });
    }

    // If cardID or PIN is empty
    if (responseData.length()==1) {
        QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);
        QJsonObject jsonObject = jsonDoc.object();
        ui->labelInfo->setText(jsonObject.value("message").toString());
        ui->labelInfo->show();

        //Timer for labelInfo
        QTimer::singleShot(4000, this, [this]() {
            ui->labelInfo->clear();
        });

    // If backend is up, then check CardID & PIN
    } else {
        QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);
        QJsonObject jsonObject = jsonDoc.object();

        // If card locked
        if(jsonObject.value("message").toString()== "Liian monta kirjautumisyritystä, tunnus on lukittu.") {
            ui->labelInfo->setText("Tunnus lukittu");
            ui->labelInfo->show();

            //Timer for labelInfo
            QTimer::singleShot(4000, this, [this]() {
                ui->labelInfo->clear();
            });
        }

        // If PIN or Idcard doesnt have input or do not match
        else if (!jsonObject.contains("token")) {
            ui->labelInfo->setText("Idcard ja PIN eivät täsmää.");
            ui->labelInfo->show();

            // Timer for labelInfo
            QTimer::singleShot(4000, this, [this]() {
                ui->labelInfo->clear();
            });
        }

        // If responseData have token -> Login is successful
        if (jsonObject.contains("token")) {
            // Type conversion
            QString token = jsonObject["token"].toString();
            QByteArray tokenBytes = token.toUtf8();
            QByteArray idcard = jsonObject["idcard"].toString().toUtf8();

            // Set token to AuthManager to usable easier elsewhere
            AuthManager::instance()->setToken(tokenBytes);

            // URL to get card accounts
            QString url = environment::base_url() + "api/card/" + idcard + "/accounts/";
            QNetworkRequest request(url);

            //WEB TOKEN START
            QByteArray myToken = "Bearer " + AuthManager::instance()->getToken().toUtf8();
            request.setRawHeader(QByteArray("Authorization"),(myToken));
            //WEB TOKEN END

            reply = manager->get(request);
            connect(reply, &QNetworkReply::finished, this, &MainWindow::handleAccountsResponse);
        }
    }
}

void MainWindow::handleAccountsResponse()
{
    QByteArray responseData = reply->readAll();
    QJsonDocument jsonCardDoc = QJsonDocument::fromJson(responseData);
    QJsonArray cardAccounts = jsonCardDoc.array();

    QVector<Account> accounts;

    // If no accounts -> Show noAccountView
    if (cardAccounts.size() == 0) {
        noaccountsview *objNoAccountsView = new noaccountsview(this);
        objNoAccountsView->show();
    } else {
        // Create every account account-class and add it to accounts QVector
        for (const auto &account : cardAccounts) {
            QJsonObject obj = account.toObject();

            QString idAccount = obj["idaccount"].toString();

            int idOwnerInt = obj["idowner"].toInt();
            QString idOwner = QString::number(idOwnerInt);

            QString accountType = obj["account_type"].toString();

            QString balanceStr = obj["balance"].toString();
            balanceStr.remove(".");
            qint64 balance = balanceStr.toLongLong();

            QString creditStr = obj["credit_limit"].toString();
            creditStr.remove(".");
            qint64 creditLimit = creditStr.toLongLong();

            Account acc (idAccount,idOwner,balance,creditLimit,accountType);
            // Add account to accounts to QVecotr
            accounts.append(acc);
        }
        // If two accounts -> Then selecting view
        if (accounts.size() == 2){
            cardselectiondialog *objCardSelectionView = new cardselectiondialog(accounts,this);
            objCardSelectionView->show();
        // If one account -> Open accountview
        } else {
            accountview *objAccountView = new accountview(accounts[0], this);
            objAccountView->show();
    }
    reply->deleteLater();
    }
}
