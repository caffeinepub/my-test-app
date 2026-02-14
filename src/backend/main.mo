import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import List "mo:core/List";

actor {
  type Question = {
    question : Text;
    correctAnswer : Text;
    optionA : Text;
    optionB : Text;
    optionC : Text;
    optionD : Text;
  };

  type AirtableCreds = {
    apiToken : Text;
    baseId : Text;
    tableId : Text;
  };

  var defaultTableId : Text = "Questions";
  var defaultTableView : Text = "Gridview";

  // Storage for principal-specific Airtable credentials
  let credsStorage = List.empty<(Principal, AirtableCreds)>();

  func getCredsForPrincipal(p : Principal) : ?AirtableCreds {
    credsStorage.reverseValues().find(func((principal, _)) { principal == p }).map(func((_, creds)) { creds });
  };

  public shared ({ caller }) func setDefaultAirtableConfig(baseId : Text, tableName : Text) : async () {
    if (Principal.fromText("5ur4c-5mj7w-qqvzl-5jqbb-aexny-k6o4v-43du3-p5c5m-3iy2a-zyxtj-wqe") != caller) {
      Runtime.trap("Not authorized for setting default configuration!");
    };
    defaultTableId := tableName;
  };

  public shared ({ caller }) func setAirtableCreds(apiToken : Text, baseId : Text, tableId : ?Text) : async () {
    let cred = {
      apiToken;
      baseId;
      tableId = switch (tableId) {
        case (null) { defaultTableId };
        case (?t) { t };
      };
    };
    credsStorage.add((caller, cred));
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func loadQuestions() : async Text {
    let creds = switch (getCredsForPrincipal(caller)) {
      case (null) { Runtime.trap("No Airtable token for principal.") };
      case (?cred) { cred };
    };

    await OutCall.httpGetRequest(
      "https://api.airtable.com/v0/" #
      creds.baseId # "/" #
      creds.tableId # "?view=" # defaultTableView,
      [{ name = "Authorization"; value = "Bearer " # creds.apiToken }],
      transform,
    );
  };

  public query func isConfigured() : async Bool {
    not credsStorage.isEmpty();
  };

  public query ({ caller }) func isPrincipalConfigured(p : Principal) : async Bool {
    getCredsForPrincipal(p) != null;
  };
};
