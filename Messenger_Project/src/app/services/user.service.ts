import { Injectable, NgZone } from '@angular/core';
import { UserCreds, ConnReq, User } from './user.model';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Socket } from 'ngx-socket-io';
import * as  firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: any;
  fireData = firebase.database().ref('/users');
  storageRef = firebase.storage().ref('/profileImages');
  fireReq = firebase.database().ref('/requests');
  fireFriends = firebase.database().ref('/friends');
  fireBuddyChats = firebase.database().ref('/buddychats');

  constructor(private socket: Socket, public ngZone: NgZone, private router: Router) {
    this.setUserOnLocal();
    this.socket.connect();
  }

  setUserOnLocal() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  removeUserOnLocal() {
    localStorage.setItem('user', null);
  }

  // setFriendsOfUser() {
  //   this.getMyFriends().then((res: any) => {
  //     if (res) {
  //       localStorage.setItem('friends', JSON.stringify(res));
  //     } else {
  //       localStorage.setItem('friends', null);
  //     }
  //   });
  // }

  // Login in with email/password
  signIn(user: UserCreds) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
    })
  }

  // Register user with email/password
  signUp(newUser) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).then(() => {
        firebase.auth().currentUser.updateProfile({
          displayName: newUser.displayName,
          photoURL: '../../assets/user.png'
        }).then(() => {
          this.fireData.child(firebase.auth().currentUser.uid).set({
            uid: firebase.auth().currentUser.uid,
            displayName: newUser.displayName,
            photoURL: '../../assets/user.png',
            email: newUser.email,
            emailVerified: firebase.auth().currentUser.emailVerified
          }).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    });
  }

  /* ---------------- Register with Gmail ----------------------*/

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return firebase.auth().signInWithPopup(provider).then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['/home']);
      })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Data user in Realtime Database
  SetUserData(user) {
    const fireDataRef = firebase.database().ref(`users/${user.uid}`)
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return fireDataRef.set(userData)
  }

  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification().then(() => {
      return 1;
    }).catch(err => {
      err.message;
    });
  }

  updateVerificationMail() {
    this.fireData.child(firebase.auth().currentUser.uid).update({
      uid: firebase.auth().currentUser.uid,
      displayName: firebase.auth().currentUser.displayName,
      photoURL: firebase.auth().currentUser.photoURL,
      email: firebase.auth().currentUser.email,
      emailVerified: firebase.auth().currentUser.emailVerified
    }).then(() => {
      console.log("confirm true.")
    }).catch((err) => {
      console.log(err.message);
    })
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = firebase.auth().currentUser;
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = firebase.auth().currentUser;
    return (user.emailVerified != false) ? true : false;
  }

  // Recover password
  PasswordRecover(email) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err)
        });
    });
  }

  // Update new image
  updateImage(imageData) {
    const filename = imageData.name;
    const path = `/profileImages/${new Date().getTime()}_${filename}`;
    const fileRef = firebase.storage().ref(path);
    return new Promise((resolve, reject) => {
      fileRef.put(imageData).then((snap) => {
        this.storageRef.child(`/${snap.metadata.name}`).getDownloadURL().then((url) => {
          firebase.auth().currentUser.updateProfile({
            displayName: firebase.auth().currentUser.displayName,
            photoURL: url
          }).then(() => {
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
              uid: firebase.auth().currentUser.uid,
              displayName: firebase.auth().currentUser.displayName,
              email: firebase.auth().currentUser.email,
              photoURL: url
            }).then(() => {
              resolve(url);
            }).catch((err) => {
              reject(err);
            })
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Upload a image send message  
  uploadImage(imageData) {
    const filename = imageData.name;
    const path = `/messageImages/${new Date().getTime()}_${filename}`;
    const fileRef = firebase.storage().ref(path);
    return new Promise((resolve, reject) => {
      fileRef.put(imageData).then((snap) => {
        firebase.storage().ref('/messageImages').child(`/${snap.metadata.name}`).getDownloadURL().then((url) => {
          resolve(url);
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    });
  }

  // Delete old image
  deleteImage() {

  }

  // Update new displayname
  updateDisplayName(newName) {
    return new Promise((resolve, reject) => {
      firebase.auth().currentUser.updateProfile({
        displayName: newName,
        photoURL: firebase.auth().currentUser.photoURL
      }).then(() => {
        this.fireData.child(firebase.auth().currentUser.uid).update({
          displayName: newName,
          photoURL: firebase.auth().currentUser.photoURL,
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          resolve({ success: true });
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Get all user
  getListUser() {
    return new Promise((resolve, reject) => {
      this.fireData.orderByChild('uid').once('value', (snapshot) => {
        let allUser = snapshot.val();
        let temparr = [];
        for (var key in allUser) {
          temparr.push(allUser[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Send request friend
  sendRequest(req: ConnReq) {
    return new Promise((resolve, reject) => {
      this.fireReq.child(req.recipient).push({
        sender: req.sender,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Get request friend
  userdetails;
  getMyRequests() {
    return new Promise((resolve, reject) => {
      let allmyrequests;
      var myrequests = [];
      this.fireReq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
        allmyrequests = snapshot.val();
        myrequests = [];
        for (var i in allmyrequests) {
          myrequests.push(allmyrequests[i].sender);
        }
        this.getListUser().then((res: any) => {
          let allusers = res;
          this.userdetails = [];
          for (var j in myrequests)
            for (var key in allusers) {
              if (myrequests[j] === allusers[key].uid) {
                this.userdetails.push(allusers[key]);
              }
            }
          resolve(this.userdetails);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  // Accept request friend
  acceptReq(buddy) {
    return new Promise((resolve, reject) => {
      this.fireFriends.child(firebase.auth().currentUser.uid).push({
        uid: buddy.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        this.fireFriends.child(buddy.uid).push({
          uid: firebase.auth().currentUser.uid,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.deleteReq(buddy).then(() => {
            resolve({ success: true });
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Delete request friend
  deleteReq(buddy) {
    return new Promise((resolve, reject) => {
      this.fireReq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
        let someKey;
        for (var key in snapshot.val()) {
          someKey = key;
        }
        this.fireReq.child(firebase.auth().currentUser.uid).child(someKey).remove().then(() => {
          resolve({ success: true });
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // Get my friends
  getMyFriends(uid) {
    return new Promise((resolve, reject) => {
      let friendsUid = [];
      this.fireFriends.child(uid).once('value', (snapshot) => {
        let allFriends = snapshot.val();
        for (var i in allFriends) {
          friendsUid.push(allFriends[i].uid);
        }
        this.getListUser().then((users: any) => {
          let myFriends = [];
          for (var j in friendsUid) {
            for (var key in users) {
              if (friendsUid[j] === users[key].uid) {
                myFriends.push(users[key]);
              }
            }
          }
          resolve(myFriends);
        }).catch((err) => {
          reject(err);
        })
      })
    })
  }

  // get list is not friends
  getNotFriends(uid) {
    return new Promise((resolve, reject) => {
      let notFriends = []
      this.getMyFriends(uid).then((res: any) => {
        let allFriends = res;
        let idAllFriend = [];
        for (const j in allFriends) {
          idAllFriend.push(allFriends[j].uid)
        }
        this.getListUser().then((resp: any) => {
          let allUser = resp;
          for (var i in allUser) {
            if (idAllFriend.indexOf(allUser[i].uid) == -1) {
              notFriends.push(allUser[i]);
            }
          }
          resolve(notFriends);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteFriend(friendUid) {
    return new Promise((resolve, reject) => {
      this.fireFriends.child(firebase.auth().currentUser.uid).orderByChild('uid').equalTo(friendUid).once('value', (snapshot) => {
        let someKey;
        for (const key in snapshot.val()) {
          someKey = key;
        }
        this.fireFriends.child(firebase.auth().currentUser.uid).child(someKey).remove().then(() => {
          this.fireFriends.child(friendUid).orderByChild('uid').equalTo(firebase.auth().currentUser.uid).once('value', (snap) => {
            let idKey;
            for (const key in snap.val()) {
              idKey = key;
            }
            this.fireFriends.child(friendUid).child(idKey).remove().then(() => {
              resolve({ success: true });
            }).catch((err) => {
              reject(err);
            });
          });
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  /* ----------Buddy Chat --------------*/
  buddy: any;
  buddyMessages = [];

  initializeBuddy(buddy) {
    this.buddy = buddy;
  }

  addNewMessage(msg, isPhoto) {
    if (this.buddy) {
      return new Promise((resolve, reject) => {
        this.fireBuddyChats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          msg: msg,
          isImaged: isPhoto,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.fireBuddyChats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            msg: msg,
            isImaged: isPhoto,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve({ success: true });
          }).catch((err) => {
            reject(err);
          })
        })
      })
    }
  }

  getBuddyMessages() {
    return new Promise((resolve, reject) => {
      let temp;
      this.fireBuddyChats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).on('value', (snapshot) => {
        this.buddyMessages = [];
        temp = snapshot.val();
        for (var tempkey in temp) {
          this.buddyMessages.push(temp[tempkey]);
        }
        resolve(this.buddyMessages);
      })
    })
  }

  deleteBuddyChat(friend) {
    return new Promise((resolve, reject) => {
      this.fireBuddyChats.child(firebase.auth().currentUser.uid).child(friend.uid).remove().then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getListChatted(uid) {
    return new Promise((resolve, reject) => {
      this.fireBuddyChats.child(uid).once('value', (snapshot) => {
        let chatted = [];
        let allFriend = [];
        let key = [];
        snapshot.forEach((childSnapshot) => {
          let childKey = childSnapshot.key;
          chatted.push(childKey);
        });
        this.getMyFriends(uid).then((res: any) => {
          allFriend = res;
          for (var i in chatted) {
            for (var j in allFriend) {
              if (allFriend[j].uid == chatted[i]) {
                key.push(allFriend[j]);
              }
            }
          }
          resolve(key);
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  /* ------------- End Chat --------------*/


  // Sign-out 
  SignOut() {
    return firebase.auth().signOut();
  }

}
