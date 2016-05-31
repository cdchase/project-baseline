# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.require_version ">= 1.6.5"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.define :web do |web|
    web.vm.box = "centos72-min"
    web.vm.box_url = "http://vagrant.cdchase.com/box/centos72-min/virtualbox/vagrant-centos72-min-virtualbox.box"
    web.vm.box_download_checksum = "6a8a442a0ba5ac5c260323b7f55027b3c595d4f4e1c3418a19bd55207a513d9d"
    web.vm.box_download_checksum_type = "sha256"

#    web.vm.box = "centos72"

  #  config.vm.box = "centos70"
  #  config.vm.box_url = "http://vagrant.cdchase.com/box/centos70/virtualbox/vagrant-centos70-virtualbox.box"
  #  config.vm.box_download_checksum = "7c8e730d6852686e6d6d259429eef1ffc1286c8f00964ae795e77dc3ff3c9a43"
  #  config.vm.box_download_checksum_type = "sha256"

# Using hostsupdater plugin to supply hostname management via /etc/hosts
# See: https://github.com/cogitatio/vagrant-hostsupdater
# Eliminates need for forwarded_ports
    web.vm.hostname = "baseline"
    web.vm.network :private_network, ip: "10.1.46.100"

    web.vm.synced_folder "www_root", "/var/www/html"

    web.vm.provision :shell, run: "always" do |shell|
      shell.inline = "setenforce 0"
    end

    web.vm.provision "puppet" do |puppet|
      puppet.manifests_path = "manifests"
      puppet.manifest_file  = "default.pp"
      puppet.module_path = "modules"
#      puppet.hiera_config_path = "hiera.yaml"
#      puppet.options           = "--pluginsync"
    end
  end

  config.vm.define :db do |db|
    db.vm.box = "centos72-min"
    db.vm.hostname = "baseline-db"
    db.vm.network :private_network, ip: "10.1.46.200"
  end


end
