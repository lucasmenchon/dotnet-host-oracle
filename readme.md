Estou hospedando o site na Oracle Cloud e você pode acessar ele. O Domínio é este https://tilucas.com/

Este é um app web feito com aspnet core para exemplo, e como consegui realizar deploy dele na Oracle Cloud com Nginx.

Fonte: https://labs.sogeti.com/deploy-net-core-web-api-to-linux-ubuntu/ 
## **Primeiro foi instalado o DOTNET NO UBUNTU.** 
sudo apt-get install wget apt-transport-https 

sudo wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb 

sudo dpkg -i packages-microsoft-prod.deb 

sudo apt-get update 

sudo apt-get install dotnet-sdk-6.0

**Configuração do Linux VM**

Você precisará de acesso SSH à máquina virtual e permissões de raiz. Em primeiro lugar, vamos atualizar o VM e instalar o software mínimo necessário. 

<pre<code>sudo apt update </code></pre>

sudo apt -y upgrade

**upgrade** é usado para instalar as versões mais recentes de todos os pacotes atualmente instalados no sistema 

sudo reboot

Após a execução do comando de atualização, precisamos reiniciar um VM para garantir que a atualização seja concluída. 
## **Baixe e instale o tempo de execução** 
Para executar um aplicativo .Net Core em qualquer sistema operacional, precisamos instalar o .Net Core Runtime. A versão mais recente atual do .Net Core é 3.1 e você pode instalá-lo com o seguinte comando: 

sudo apt-get update; \

`  `sudo apt-get install -y apt-transport-https && \

`  `sudo apt-get update && \

`  `sudo apt-get install -y aspnetcore-runtime-6.0

Instruções detalhadas e guia de solução de problemas está [aqui ](https://docs.microsoft.com/en-gb/dotnet/core/install/linux-ubuntu). 
## **Instalar o Nginx** 
NginX, é um servidor web que também pode ser usado como um proxy reverso, balanceador de carga, proxy de e-mail e cache HTTP. 

Você pode instalá-lo com um comando a seguir: 

sudo apt-get install nginx

ou a [instrução ](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/#official-debian-ubuntu-packages)completa está localizada em um site oficial. 

Inicie o Nginx com um comando: 

sudo service nginx start
## **Configurar Nginx** 
Para configurar o Nginx como um proxy reverso para encaminhar solicitações ao seu aplicativo ASP.NET Core, modifique */etc/nginx/sites disponíveis/padrão*. Abra-o em um editor de texto e substitua o conteúdo pelo seguinte: 

Se você quiser obter mais detalhes sobre o que é proxy reverso e por que precisamos usá-lo leia este [artigo](https://en.wikipedia.org/wiki/Reverse_proxy). 

nano /etc/nginx/sites-available/default

Adicione o seguinte codigo: 
<hr>
server {

`    `listen        80;

`    `server\_name  SEU\_DOMINIO;

`    `location / {

`        `proxy\_pass         http://localhost:5000;

`        `proxy\_http\_version 1.1;

`        `proxy\_set\_header   Upgrade $http\_upgrade;

`        `proxy\_set\_header   Connection keep-alive;

`        `proxy\_set\_header   Host $host;

`        `proxy\_cache\_bypass $http\_upgrade;

`        `proxy\_set\_header   X-Forwarded-For $proxy\_add\_x\_forwarded\_for;

`        `proxy\_set\_header   X-Forwarded-Proto $scheme;

`    `}

}
<hr>
Salve o arquivo e verifique a sintaxe com o seguinte comando: 

sudo nginx -t

Se tudo estiver ok, reprise o Ngnix para aplicar novas configurações: 

sudo nginx -s reload
## **Configure api web .Net Core** 
Em primeiro lugar, você precisará construir uma api web no modo de liberação em sua máquina. Para fazer isso execute o comando na localização raiz do seu aplicativo: 

dotnet publish --configuration Release

Crie uma pasta no Ubuntu **/var/www/\_app\_nome**

Copie todos os arquivos para essa pasta. Você pode usar FTP (se estiver disponível em seu VM) ou SSH File Transfer Protocol (estou usando CyberDuck para isso). 

Em terminal navegue até sua pasta de aplicação e execute o aplicativo. Isto é apenas para verificar se funciona: 

dotnet <app\_assembly.dll>

Se o aplicativo começou sem problemas pressione CTRL + C para pará-lo. 

Queremos que nosso aplicativo seja executado a partir de serviços. Desta forma, podemos instruir o Ubuntu a reiniciar nosso aplicativo automaticamente se ele falhar ou após a reinicialização do VM. 

Crie um arquivo de serviço: 

sudo nano /etc/systemd/system/kestrel-<seu\_app>.service

Copie e cole este codigo com informações de seu app:
<hr>
[Unit]

Description=<Nome App>

[Service]

WorkingDirectory=/var/www/<app\_diretorio>

ExecStart=/usr/bin/dotnet /var/www/<app\_diretorio>/<app\_nome>.dll

Restart=always

\# Restart service after 10 seconds if the dotnet service crashes:

RestartSec=10

KillSignal=SIGINT

SyslogIdentifier=dotnet-example

User=www-data

Environment=ASPNETCORE\_ENVIRONMENT=Production

Environment=DOTNET\_PRINT\_TELEMETRY\_MESSAGE=false

[Install]

WantedBy=multi-user.target
<hr>
Salve o arquivo do que ativar e iniciar o serviço: 

sudo systemctl enable kestrel-<app\_nome>.service

sudo systemctl start kestrel-<app\_nome>.service 

Você pode verificar o status do serviço com o seguinte comando: 

sudo systemctl status kestrel-alfalab.service

**Isso é muito importante para liberar a porta 80 e o projeto funcionar!**

sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT