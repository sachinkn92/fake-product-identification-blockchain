// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        uint256 id;
        string name;
        string manufacturer;
        string qrHash; // hash of QR or product data
        address addedBy;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    mapping(string => bool) public qrExists;

    event ProductRegistered(
        uint256 id,
        string name,
        string manufacturer,
        string qrHash,
        address addedBy,
        uint256 timestamp
    );

    function registerProduct(
        uint256 _id,
        string memory _name,
        string memory _manufacturer,
        string memory _qrHash
    ) public {
        //require(products[_id].timestamp == 0, "Product ID already used");
        //require(!qrExists[_qrHash], "QR already registered");

        products[_id] = Product({
            id: _id,
            name: _name,
            manufacturer: _manufacturer,
            qrHash: _qrHash,
            addedBy: msg.sender,
            timestamp: block.timestamp
        });

        qrExists[_qrHash] = true;

        emit ProductRegistered(
            _id,
            _name,
            _manufacturer,
            _qrHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyProductById(uint256 _id) public view returns (bool) {
        return products[_id].timestamp != 0;
    }

    function verifyProductByQr(string memory _qrHash)
        public
        view
        returns (bool)
    {
        return qrExists[_qrHash];
    }
}
