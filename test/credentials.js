'use strict';

var _ = require('lodash');
var chai = chai || require('chai');
var sinon = sinon || require('sinon');
var should = chai.should();

var Constants = require('../lib/common/constants');
var Credentials = require('../lib/credentials');
var TestData = require('./testdata');

describe('Credentials', function() {

  describe('#create', function() {
    it('Should create', function() {
      var c = Credentials.create('livenet');
      should.exist(c.xPrivKey);
      should.exist(c.copayerId);
    });

    it('Should create random credentials', function() {
      var all = {};
      for (var i = 0; i < 10; i++) {
        var c = Credentials.create('livenet');
        var exist = all[c.xPrivKey];
        should.not.exist(exist);
        all[c.xPrivKey] = 1;
      }
    });
  });

  describe('#getBaseAddressDerivationPath', function() {
    it('should return path for livenet', function() {
      var c = Credentials.create('livenet');
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/44'/83'/0'");
    });
    it('should return path for testnet account 2', function() {
      var c = Credentials.create('testnet');
      c.account = 2;
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/44'/1'/2'");
    });
    it('should return path for BIP45', function() {
      var c = Credentials.create('livenet');
      c.derivationStrategy = Constants.DERIVATION_STRATEGIES.BIP45;
      var path = c.getBaseAddressDerivationPath();
      path.should.equal("m/45'");
    });
  });

  describe('#getDerivedXPrivKey', function() {
    it('should derive extended private key from master livenet', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP44');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9zNmuvXQMPPd9NNUoKBffn5i5dMRRXHL2xoNuYne3yDy34tQamhwm6CqMpDUHV25gQsuE6yKqQNKwKhqsJzqdFTiFGU4U8WJpW9QzKYZq2V');
    });
    it('should derive extended private key from master testnet', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPfPX8avSJXY1tZYJJESNg8vR88i8rJFkQJm6HgPPtDEmD36NLVSJWV5ieejVCK62NdggXmfMEHog598PxvXuLEsWgE6tKdwz', 0, 'BIP44');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8gBu8N7JbHZs7MsW4kgE8LAYMhGJES9JP6DHsj2gw9Tc5PrF5Grr9ynAZkH1LyWsxjaAyCuEMFKTKhzdSaykpqzUnmEhpLsxfujWHA66N93');
    });
    it('should derive extended private key from master BIP48 livenet', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP48');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9zNNwgRvwkY8eAsZDqnNVrAweRsttMsvbJwWZGEm1jXfaZRxSNGvraKpc2i78JG92Xxt4SzJ5WyUhduVBTEigeyQLbCAxXZ4Ttuy3ayxKYH');
    });
    it('should derive extended private key from master livenet (BIP45)', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 0, 'BIP45');
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('xprv9vDaAbbvT8LHKr8v5A2JeFJrnbQk6ZrMDGWuiv2vZgSyugeV4RE7Z9QjBNYsdafdhwEGb6Y48DRrXFVKvYRAub9ExzcmJHt6Js6ybJCSssm');
    });
    it('should set addressType & BIP45', function() {
      var c = Credentials.fromExtendedPrivateKey('xprv9s21ZrQH143K3zLpjtB4J4yrRfDTEfbrMa9vLZaTAv5BzASwBmA16mdBmZKpMLssw1AzTnm31HAD2pk2bsnZ9dccxaLD48mRdhtw82XoiBi', 8, 'BIP45');
      c.addWalletInfo(1, 'name', 1, 1, 'juan');
      c.account.should.equal(8);
    });
    it('should derive compliant child', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPe8dG56dwUudFBQTbwWgsDJrJiT7WpbDKqMqtAtAqRwRqezvMXcc2vKtKRkDU73PzyUGEZp6kwJiHGzYDRShvSn9P3NZwc4T', 0, 'BIP44');
      c.compliantDerivation.should.be.true;
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8g9WqWMKhrQ5xxiMTt1jkaYmAjb2y6zwiVeyt6pUAXxSrstCvNbJVJ7mh3i84rv9yAXvzZyuEkybbMtuj9jETuDW8eKn5HRqcTcntnE3vSz');
    });
    it('should derive non-compliant child', function() {
      var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPe8dG56dwUudFBQTbwWgsDJrJiT7WpbDKqMqtAtAqRwRqezvMXcc2vKtKRkDU73PzyUGEZp6kwJiHGzYDRShvSn9P3NZwc4T', 0, 'BIP44', {
        nonCompliantDerivation: true
      });
      c.compliantDerivation.should.be.false;
      var xpk = c.getDerivedXPrivKey().toString();
      xpk.should.equal('tprv8g9WqWMKhrQ5xxiMTt1jkaYmAjb2y6zwiVeyt6pUAXxSrstCvNbJVJ7mh3i84rv9yAXvzZyuEkybbMtuj9jETuDW8eKn5HRqcTcntnE3vSz');
    });
  });

  describe('#fromExtendedPrivateKey', function() {
    it('Should create credentials from seed', function() {
      var xPriv = 'xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc';
      var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');

      c.xPrivKey.should.equal('xprv9s21ZrQH143K2TjT3rF4m5AJcMvCetfQbVjFEx1Rped8qzcMJwbqxv21k3ftL69z7n3gqvvHthkdzbW14gxEFDYQdrRQMub3XdkJyt3GGGc');
      c.xPubKey.should.equal('xpub6CgAyVMbw86ZSMdAifmLLbfDPZU7T5NuP8vBLHJ8iWGrDKYYNsJEDx2mbsfdCmWVqEeqKvfWbz3ZRdZUnXuktW3YBaXJpnfUpbpJJDBM3Tu');
      c.copayerId.should.equal('918ca73e6392a50bae0c5c5accad639af2f74a4ab0b79487382388f7d014f836');
      c.network.should.equal('livenet');
      c.personalEncryptingKey.should.equal('M4MTmfRZaTtX6izAAxTpJg==');
    });
    describe('Compliant derivation', function() {
      it('Should create compliant base address derivation key', function() {
        var xPriv = 'xprv9s21ZrQH143K4HHBKb6APEoa5i58fxeFWP1x5AGMfr6zXB3A6Hjt7f9LrPXp9P7CiTCA3Hk66cS4g8enUHWpYHpNhtufxSrSpcbaQyVX163';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.xPubKey.should.equal('xpub6CHGtAkuhRAnvJh88N4L7Bq2HM5idhTvroCa64E9bdEX5UmiHPJ9s94YSZpqKuKsWdqMUDQRoADNijUQ8vt4gVCus8XgrZSbpji53oyb8Zo');
      });

      it('Should create compliant request key', function() {
        var xPriv = 'xprv9s21ZrQH143K3xMCR1BNaUrTuh1XJnsj8KjEL5VpQty3NY8ufgbR8SjZS8B4offHq6Jj5WhgFpM2dcYxeqLLCuj1wgMnSfmZuPUtGk8rWT7';
        var c = Credentials.fromExtendedPrivateKey(xPriv, 0, 'BIP44');
        c.requestPrivKey.should.equal('559371263eb0b2fd9cd2aa773ca5fea69ed1f9d9bdb8a094db321f02e9d53cec');
      });

      it('should accept non-compliant derivation as a parameter when importing', function() {
        var c = Credentials.fromExtendedPrivateKey('tprv8ZgxMBicQKsPe8dG56dwUudFBQTbwWgsDJrJiT7WpbDKqMqtAtAqRwRqezvMXcc2vKtKRkDU73PzyUGEZp6kwJiHGzYDRShvSn9P3NZwc4T', 0, 'BIP44', {
          nonCompliantDerivation: true
        });
        c.xPrivKey.should.equal('tprv8ZgxMBicQKsPe8dG56dwUudFBQTbwWgsDJrJiT7WpbDKqMqtAtAqRwRqezvMXcc2vKtKRkDU73PzyUGEZp6kwJiHGzYDRShvSn9P3NZwc4T');
        c.compliantDerivation.should.be.false;
        c.xPubKey.should.equal('tpubDCqYyvPZrE5krRk9MXgL9zCsjm6y8SBrHoFmAcrmaokqhN8yYmQtfnjdsADJGYwXNkxGUbMfpVSCxrmrmMTrNhhARiJvFr6e7o69AcNwR91');
        c.getDerivedXPrivKey().toString().should.equal("tprv8g9WqWMKhrQ5xxiMTt1jkaYmAjb2y6zwiVeyt6pUAXxSrstCvNbJVJ7mh3i84rv9yAXvzZyuEkybbMtuj9jETuDW8eKn5HRqcTcntnE3vSz");
      });
    });
  });

  describe('#fromMnemonic', function() {
    it('Should create credentials from mnemonic BIP44', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K36Qi5XRScDaVd2Y8euseex3D7kT31Sp6aoTgwPt1YFSTHsbiqxwfiufhvijo1N6NrMJ4PKPAExsxocWncPwF9M65CY15Zai');
      c.network.should.equal('livenet');
      c.account.should.equal(0);
      c.derivationStrategy.should.equal('BIP44');
      c.xPubKey.should.equal('xpub6C7BzdXPWnoMWWSvWQ3jJzTUe9PE4v4f6QTkNJ992VwY8sBVmXfNfhvmPZx5MD6fDHrmWjqh22xWyeadjf9GYtSmcdxcPRhvB5SNB7wVP7P');
      c.getBaseAddressDerivationPath().should.equal("m/44'/83'/0'");
    });

    it('Should create credentials from mnemonic BIP48', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP48');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K36Qi5XRScDaVd2Y8euseex3D7kT31Sp6aoTgwPt1YFSTHsbiqxwfiufhvijo1N6NrMJ4PKPAExsxocWncPwF9M65CY15Zai');
      c.network.should.equal('livenet');
      c.account.should.equal(0);
      c.derivationStrategy.should.equal('BIP48');
      c.xPubKey.should.equal('xpub6CpXMuXdSvGwwT5smFTCixxHdTF2nkHFT4dJntHtZc9vBVFtUZMEfir8NwxaYdkQKUha8U8ETU3JMsm5RSLj127G7GxrPH9PQMGoHKJr9EH');
      c.getBaseAddressDerivationPath().should.equal("m/48'/83'/0'");
    });

    it('Should create credentials from mnemonic account 1', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, '', 1, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K36Qi5XRScDaVd2Y8euseex3D7kT31Sp6aoTgwPt1YFSTHsbiqxwfiufhvijo1N6NrMJ4PKPAExsxocWncPwF9M65CY15Zai');
      c.account.should.equal(1);
      c.xPubKey.should.equal('xpub6C7BzdXPWnoMaw6iJpoWcwMSjVoyx26ouWGqbgyJChVSqMt6GiFHQyoopJenFRY2QqPdxnxYZPSiPKSvrvi2Gnejm3k7qQhuSRA4GGdWPhn');
      c.getBaseAddressDerivationPath().should.equal("m/44'/83'/1'");
    });

    it('Should create credentials from mnemonic with undefined/null passphrase', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, undefined, 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K36Qi5XRScDaVd2Y8euseex3D7kT31Sp6aoTgwPt1YFSTHsbiqxwfiufhvijo1N6NrMJ4PKPAExsxocWncPwF9M65CY15Zai');
      c = Credentials.fromMnemonic('livenet', words, null, 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K36Qi5XRScDaVd2Y8euseex3D7kT31Sp6aoTgwPt1YFSTHsbiqxwfiufhvijo1N6NrMJ4PKPAExsxocWncPwF9M65CY15Zai');
    });

    it('Should create credentials from mnemonic and passphrase', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('livenet', words, 'húngaro', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K26Wdx9p8ph7F9tFUZJrP8imQi4FpT3dqdRR4MaYTghn2weQqwGhzC3iUaQ5gd98hnpYT7krQF2EY5utEpCT3CbuSnT2WTDb');
    });

    it('Should create credentials from mnemonic and passphrase for testnet account 2', function() {
      var words = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
      var c = Credentials.fromMnemonic('testnet', words, 'húngaro', 2, 'BIP44');
      c.xPrivKey.should.equal('tprv8ZgxMBicQKsPcukAcifdzLjEU1fgnptPUGgXaUgGw28KR2A9LwtDCT9UrpaVwe6JZVFFaVhSnViWFg6CEyCM45W8cZ6YUZB67hesE7UJzxS');
      c.network.should.equal('testnet');
      c.xPubKey.should.equal('tpubDCMeJY5EK7qVjvBfwccTYki8yDmVLZTssW3eQdYCXDz6yKv6CbrYT11ai5aenDnFkfbWSYtGynT8fkD2Qa4A15RjkTSScx4ZNojSotn5zYe');
      c.getBaseAddressDerivationPath().should.equal("m/44'/1'/2'");
    });

    it('Should create credentials from mnemonic (ES)', function() {
      var words = 'afirmar diseño hielo fideo etapa ogro cambio fideo toalla pomelo número buscar';
      var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
      c.xPrivKey.should.equal('xprv9s21ZrQH143K2981nEvaXYEPJVJDTsUxpsxEK5weSt9otKw4YouFcqA7mQUNhd2tALH7bShXdZCAYXfAW5tLr4Y7SPctgSVwd8FQndLuoYX');
      c.network.should.equal('livenet');
    });

    describe('Compliant derivation', function() {
      it('Should create compliant base address derivation key from mnemonic', function() {
        var words = "shoulder sphere pull seven top much black copy labor dress depth unit";
        var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
        c.xPrivKey.should.equal('xprv9s21ZrQH143K3cu8rotoKq1KU1V2pYDQ8W2vjhmEGK94ijLL6qKNf3efGWMjoxbVJCvvywW4puKJpDcPDD43Xo3njepgxVUhpPNS1c6TYNT');
        c.xPubKey.should.equal('xpub6C9aiZvcNimjvnzAPKHLGiVY6Ms34EVYJefUWQnpeahzszWb9ZSf7ncG2QC68yzf7qGHWX5XFkf5twVVqKumZ7Tkd1hq1mPouMqfmfkJrda');
      });

      it('Should create compliant request key from mnemonic', function() {
        var words = "pool stomach bridge series powder mammal betray slogan pass roast neglect reunion";
        var c = Credentials.fromMnemonic('livenet', words, '', 0, 'BIP44');
        c.xPrivKey.should.equal('xprv9s21ZrQH143K27BsCiU5Q8qrga5BnhqeNxhUxwL5SadiSa94KiJ35zUM1v4UN5Gt7wJ2qVTvNpY9bGU5ZmWehdqGqBzPuV5tFUWczLHcXkL');
        c.requestPrivKey.should.equal('2df2fc373e19bb233e38027f831252cf4080262c0437b1e89b1d2033f36cae91');
      });
      it('should accept non-compliant derivation as a parameter when importing', function() {
        var c = Credentials.fromMnemonic('testnet', 'level unusual burger hole call main basic flee drama diary argue legal', '', 0, 'BIP44', {
          nonCompliantDerivation: true
        });
        c.xPrivKey.should.equal('tprv8ZgxMBicQKsPe8dG56dwUudFBQTbwWgsDJrJiT7WpbDKqMqtAtAqRwRqezvMXcc2vKtKRkDU73PzyUGEZp6kwJiHGzYDRShvSn9P3NZwc4T');
        c.compliantDerivation.should.be.false;
        c.xPubKey.should.equal('tpubDCqYyvPZrE5krRk9MXgL9zCsjm6y8SBrHoFmAcrmaokqhN8yYmQtfnjdsADJGYwXNkxGUbMfpVSCxrmrmMTrNhhARiJvFr6e7o69AcNwR91');
        c.getDerivedXPrivKey().toString().should.equal("tprv8g9WqWMKhrQ5xxiMTt1jkaYmAjb2y6zwiVeyt6pUAXxSrstCvNbJVJ7mh3i84rv9yAXvzZyuEkybbMtuj9jETuDW8eKn5HRqcTcntnE3vSz");
      });
    });
  });

  describe('#createWithMnemonic', function() {
    it('Should create credentials with mnemonic', function() {
      var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.mnemonic.split(' ').length.should.equal(12);
      c.network.should.equal('livenet');
      c.account.should.equal(0);
    });

    it('should assume derivation compliance on new credentials', function() {
      var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
      c.compliantDerivation.should.be.true;
      var xPrivKey = c.getDerivedXPrivKey();
      should.exist(xPrivKey);
    });

    it('Should create credentials with mnemonic (testnet)', function() {
      var c = Credentials.createWithMnemonic('testnet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.mnemonic.split(' ').length.should.equal(12);
      c.network.should.equal('testnet');
    });

    it('Should return and clear mnemonic', function() {
      var c = Credentials.createWithMnemonic('testnet', '', 'en', 0);
      should.exist(c.mnemonic);
      c.getMnemonic().split(' ').length.should.equal(12);
      c.clearMnemonic();
      should.not.exist(c.getMnemonic());
    });
  });

  describe('#createWithMnemonic #fromMnemonic roundtrip', function() {
    _.each(['en', 'es', 'ja', 'zh', 'fr'], function(lang) {
      it('Should verify roundtrip create/from with ' + lang + '/passphrase', function() {
        var c = Credentials.createWithMnemonic('testnet', 'holamundo', lang, 0);
        should.exist(c.mnemonic);
        var words = c.mnemonic;
        var xPriv = c.xPrivKey;
        var path = c.getBaseAddressDerivationPath();

        var c2 = Credentials.fromMnemonic('testnet', words, 'holamundo', 0, 'BIP44');
        should.exist(c2.mnemonic);
        words.should.be.equal(c2.mnemonic);
        c2.xPrivKey.should.equal(c.xPrivKey);
        c2.network.should.equal(c.network);
        c2.getBaseAddressDerivationPath().should.equal(path);
      });
    });

    it('Should fail roundtrip create/from with ES/passphrase with wrong passphrase', function() {
      var c = Credentials.createWithMnemonic('testnet', 'holamundo', 'es', 0);
      should.exist(c.mnemonic);
      var words = c.mnemonic;
      var xPriv = c.xPrivKey;
      var path = c.getBaseAddressDerivationPath();

      var c2 = Credentials.fromMnemonic('testnet', words, 'chaumundo', 0, 'BIP44');
      c2.network.should.equal(c.network);
      c2.getBaseAddressDerivationPath().should.equal(path);
      c2.xPrivKey.should.not.equal(c.xPrivKey);
    });
  });

  describe('Private key encryption', function() {
    describe('#encryptPrivateKey', function() {
      it('should encrypt private key and remove cleartext', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        should.exist(c.xPrivKeyEncrypted);
        should.exist(c.mnemonicEncrypted);
        should.not.exist(c.xPrivKey);
        should.not.exist(c.mnemonic);
      });
      it('should fail to encrypt private key if already encrypted', function() {
        var c = Credentials.create('livenet');
        c.encryptPrivateKey('password');
        var err;
        try {
          c.encryptPrivateKey('password');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
      });
    });
    describe('#decryptPrivateKey', function() {
      it('should decrypt private key', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        should.exist(c.xPrivKey);
        should.exist(c.mnemonic);
        should.not.exist(c.xPrivKeyEncrypted);
        should.not.exist(c.mnemonicEncrypted);
      });
      it('should fail to decrypt private key with wrong password', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        c.encryptPrivateKey('password');

        var err;
        try {
          c.decryptPrivateKey('wrong');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
        c.isPrivKeyEncrypted().should.be.true;
        should.exist(c.mnemonicEncrypted);
        should.not.exist(c.mnemonic);
      });
      it('should fail to decrypt private key when not encrypted', function() {
        var c = Credentials.create('livenet');

        var err;
        try {
          c.decryptPrivateKey('password');
        } catch (ex) {
          err = ex;
        }
        should.exist(err);
        c.isPrivKeyEncrypted().should.be.false;
      });
    });
    describe('#getKeys', function() {
      it('should get keys regardless of encryption', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        var keys = c.getKeys();
        should.exist(keys);
        should.exist(keys.xPrivKey);
        should.exist(keys.mnemonic);
        keys.xPrivKey.should.equal(c.xPrivKey);
        keys.mnemonic.should.equal(c.mnemonic);

        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        var keys2 = c.getKeys('password');
        should.exist(keys2);
        keys2.should.deep.equal(keys);

        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        var keys3 = c.getKeys();
        should.exist(keys3);
        keys3.should.deep.equal(keys);
      });
      it('should get derived keys regardless of encryption', function() {
        var c = Credentials.createWithMnemonic('livenet', '', 'en', 0);
        var xPrivKey = c.getDerivedXPrivKey();
        should.exist(xPrivKey);

        c.encryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.true;
        var xPrivKey2 = c.getDerivedXPrivKey('password');
        should.exist(xPrivKey2);

        xPrivKey2.toString('hex').should.equal(xPrivKey.toString('hex'));

        c.decryptPrivateKey('password');
        c.isPrivKeyEncrypted().should.be.false;
        var xPrivKey3 = c.getDerivedXPrivKey();
        should.exist(xPrivKey3);
        xPrivKey3.toString('hex').should.equal(xPrivKey.toString('hex'));
      });
    });
  });
});
