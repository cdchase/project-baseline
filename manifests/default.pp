resources { "firewall":
  purge => true
}

Firewall {
  before  => Class['my_fw::post'],
  require => Class['my_fw::pre'],
}

class { ['my_fw::pre', 'my_fw::post']: }

class { 'firewall': }

class { 'nginx': }

web::nginx_ssl_with_redirect { 'localhost':
  www_root => "/var/www/html",
}

include php::fpm::daemon
php::fpm::conf { 'www':
#  listen  => '127.0.0.1:9001',
  listen => '/var/run/php-fpm.sock',
  user    => 'nginx',
# For the user to exist
  require => Package['nginx'],
}

firewall { '100 allow http and https access':
  port   => [80, 443],
  proto  => tcp,
  action => accept,
}