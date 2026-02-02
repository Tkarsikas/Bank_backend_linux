#ifndef AUTHMANAGER_H
#define AUTHMANAGER_H
#include <QString>

class AuthManager
{
public:
    static AuthManager *instance();

    void setToken(const QByteArray &token);
    QString getToken() const;

private:
    QByteArray token;
};

#endif // AUTHMANAGER_H
