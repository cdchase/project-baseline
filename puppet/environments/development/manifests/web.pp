$full_web_path = '/var/www'
define web::nginx_ssl_with_redirect (
  # $backend_port         = 9000,
  $php                  = true,
  $ssl                  = false,
  $ssl_only             = false,
  $proxy                = undef,
  $www_root             = "${full_web_path}/${name}/",
  $location_cfg_append  = undef,
  $gzip                 = off;
) {

nginx::resource::vhost { "${name}":
ensure              => present,
www_root            => $www_root,
  #    location_cfg_append => { 'rewrite' => '^ https://$server_name$request_uri? permanent' },
}
if !$www_root {
  $tmp_www_root = undef
} else {
  $tmp_www_root = $www_root
}

if $php {
  php::ini { '/etc/php.ini':
    date_timezone => "America/New_York",
  }
  nginx::resource::location { "${name}_root":
    ensure              => present,
    ssl                 => $ssl,
    ssl_only            => $ssl_only,
    vhost               => "${name}",
    www_root            => $www_root,
    location            => '~ \.php$',
    index_files         => ['index.php', 'index.html', 'index.htm'],
    proxy               => undef,
    #      fastcgi         => "127.0.0.1:${backend_port}",
    fastcgi             => 'unix:/var/run/php-fpm.sock',
    fastcgi_script      => undef,
    location_cfg_append => {
      fastcgi_connect_timeout => '3m',
      fastcgi_read_timeout    => '3m',
      fastcgi_send_timeout    => '3m'
    }
  }
}
}
