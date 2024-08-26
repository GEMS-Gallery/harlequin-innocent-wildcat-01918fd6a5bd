import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor {
  // Types
  type Chain = Text;
  type Balance = Float;
  type TransactionResult = Result.Result<Text, Text>;

  // Stable variables
  stable var userBalancesEntries : [(Principal, [(Chain, Balance)])] = [];

  // Mutable variables
  var userBalances = HashMap.HashMap<Principal, HashMap.HashMap<Chain, Balance>>(0, Principal.equal, Principal.hash);

  // Helper functions
  func getOrCreateUserBalance(user: Principal) : HashMap.HashMap<Chain, Balance> {
    switch (userBalances.get(user)) {
      case null {
        let newBalance = HashMap.HashMap<Chain, Balance>(0, Text.equal, Text.hash);
        userBalances.put(user, newBalance);
        newBalance
      };
      case (?balance) balance;
    }
  };

  // System functions
  system func preupgrade() {
    userBalancesEntries := Array.map<(Principal, HashMap.HashMap<Chain, Balance>), (Principal, [(Chain, Balance)])>(
      Iter.toArray(userBalances.entries()),
      func ((user, balances)) {
        (user, Iter.toArray(balances.entries()))
      }
    );
  };

  system func postupgrade() {
    for ((user, balances) in userBalancesEntries.vals()) {
      let userBalance = getOrCreateUserBalance(user);
      for ((chain, balance) in balances.vals()) {
        userBalance.put(chain, balance);
      };
    };
    userBalancesEntries := [];
  };

  // Public functions
  public shared(msg) func authenticate() : async Text {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return "Authentication failed: Anonymous principal";
    };
    "Authentication successful";
  };

  public shared(msg) func getBalance(chain: Chain) : async ?Balance {
    let caller = msg.caller;
    let userBalance = getOrCreateUserBalance(caller);
    userBalance.get(chain);
  };

  public shared(msg) func sendTransaction(chain: Chain, amount: Float, recipient: Text) : async TransactionResult {
    let caller = msg.caller;
    let userBalance = getOrCreateUserBalance(caller);
    
    switch (userBalance.get(chain)) {
      case null #err("No balance for the specified chain");
      case (?balance) {
        if (balance < amount) {
          #err("Insufficient balance");
        } else {
          let newBalance = balance - amount;
          userBalance.put(chain, newBalance);
          #ok("Transaction successful");
        };
      };
    };
  };

  public func getTokenUtilities() : async Text {
    "Token utilities information";
  };

  // Initialize some test data
  public func initTestData() : async () {
    let testUser = Principal.fromText("2vxsx-fae");
    let testBalance = getOrCreateUserBalance(testUser);
    testBalance.put("ICP", 100.0);
    testBalance.put("ETH", 5.0);
    testBalance.put("BTC", 0.1);
  };
};
