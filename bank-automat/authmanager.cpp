#include "authmanager.h"

AuthManager *AuthManager::instance()
{
    static AuthManager instance;
    return &instance;
}

void AuthManager::setToken(const QByteArray &token)
{
    this->token = token;
}

QString AuthManager::getToken() const
{
    return token;
}

