#!/bin/bash

# Install nodejs/nvm/npm globally
install_nvm(){
	wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
}

# Use version 8*
# Make node visible to other users
install_node(){
	install_nvm
	. ~/.nvm/nvm.sh || (. ~/.bashrc && . ~/.profile)

	nvm install 8
	nvm use 8
	nvm alias default 8

}

# make node version used by nvm visible to other users
fix_nvm(){
	n=$(which node) \
		&& n=${n%/bin/node} \
		&& [[ $n == *".nvm"* ]] \
		&& chmod -R 755 $n/bin/* \
		&& cp -r $n/{bin,lib,share} /usr/local
}

install_node
fix_nvm
