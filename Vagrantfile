# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.8.1"
VAGRANTFILE_API_VERSION = "2"

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  config.vm.hostname = "project-baseline.local"

  unless Vagrant.has_plugin?('vagrant-hostmanager')
    puts 'vagrant-hostmanager plugin is not installed!'
  else
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.manage_guest = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.include_offline = true
  end

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "centos72-min"
  config.vm.box_url = "http://vagrant.cdchase.com/box/centos72-min/virtualbox/vagrant-centos72-min.box"
  config.vm.box_download_checksum = "6a8a442a0ba5ac5c260323b7f55027b3c595d4f4e1c3418a19bd55207a513d9d"
  config.vm.box_download_checksum_type = "sha256"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.

  # config.vm.network "forwarded_port", guest: 80, host: 8081

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.64.64"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.

  config.vm.synced_folder "./html", "/var/www/html"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #

  config.vm.provider "virtualbox" do |vb|
    vb.name = "ProjectBaseline"
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  end

  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   sudo apt-get update
  #   sudo apt-get install -y apache2
  # SHELL

  # FIX This! Need to be able to set context for httpd on share mount for /var/www/httpd
  # See: https://github.com/mitchellh/vagrant/issues/6970
  # https://stackoverflow.com/a/27316774/7475155
  config.vm.provision :shell, run: "always" do |shell|
    shell.inline = "setenforce 0"
  end

  # Install up-to-date Puppet if not present
  #config.vm.provision :shell, path: "../vagrant/remove_puppet_unless_modern.sh"  # in case the VM has old crap installed...
  #config.vm.provision :shell, path: "../vagrant/install_puppet_on_centos_7_x.sh"

  config.vm.provision "librarian_puppet" do |librarian_puppet|
    librarian_puppet.puppetfile_dir       = "puppet"
    librarian_puppet.placeholder_filename = ".gitignore"
    librarian_puppet.use_v1_api           = '1'
    librarian_puppet.destructive          = false
    librarian_puppet.path                 = "./puppet/environments/development/modules"
  end

  config.vm.provision "puppet" do |puppet|
      puppet.manifests_path   = "puppet/environments/development/manifests"
      puppet.manifest_file    = "default.pp"
      puppet.environment_path = "puppet/environments"
      puppet.environment      = "development"
      puppet.module_path      = "puppet/environments/development/modules"
      puppet.options          = [
                                  '--verbose',
                                  '--report',
                                  '--trace',
                                  '--debug',
                                  '--strict_variables',
                                  '--summarize',
                                  '--graph'
                                ]
    end

  config.vm.provision :shell do |shell|
    shell.inline = "sudo umount /var/www/html; sudo mount -t vboxsf -o uid=`id -u nginx`,gid=`id -g nginx`,dmode=775,fmode=664,context='system_u:object_r:httpd_sys_content_t' var_www_html /var/www/html"
#    shell.inline = "sudo umount var_www_html; if [ ! -d /media/var_www_html ]; then sudo mkdir /media/var_www_html; fi; sudo mount -t vboxsf -o uid=`id -u nginx`,gid=`id -g nginx`,dmode=775,fmode=664 var_www_html /media/var_www_html; if [ ! -L /var/www/html ]; then sudo ln -s /media/var_www_html /var/www/html; fi; sudo chcon -R --reference=/var/www /var/www/html"
  end

  config.vm.provision :hostmanager

end
