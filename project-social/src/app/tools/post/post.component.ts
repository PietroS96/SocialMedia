import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'my-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() postData!: PostData;
  creatorName!: string;
  creatorDescription!: string;
  userLikeId!: string;
  firestore = new FirebaseTSFirestore();
  likeClicked: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCreatorInfo();
    this.getLikeInfo();
  }

  onLikeClick() {
    if (this.likeClicked == false) {
      this.likeClicked = true;
    } else {
      this.likeClicked = false;
    }

    this.firestore.create({
      path: ['Posts', this.postData.postId, 'PostLikes'],
      data: {
        likeId: AppComponent.getUserDocument().userId,
        LikeName: AppComponent.getUserDocument().publicName,
      },
    });
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData.postId });
  }

  getCreatorInfo() {
    this.firestore.getDocument({
      path: ['Users', this.postData.creatorId],
      onComplete: (result) => {
        let userDocument = result.data();
        this.creatorName = userDocument!['publicName'];
        this.creatorDescription = userDocument!['description'];
      },
    });
  }

  getLikeInfo() {
    this.firestore.getDocument({
      path: ['Posts', this.postData.postId],
      onComplete: (result) => {
        let userDocument = result.data();
        this.userLikeId = userDocument!['creatorId'];
      },
    });
  }
}
