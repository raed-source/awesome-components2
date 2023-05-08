import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { animate, animateChild, group, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations:[
    trigger('List',[
      transition(':enter',[
        query('@ListItem',[
          stagger('150ms',[
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('ListItem',[
      state('default',style({
        'transform':'scale(1)',
        'background-color':'white',
        'z-index':1
      })),
      state('active',style({
        'transform':'scale(1.05)',
        'background-color':'rgb(201,157,242)',
        'z-index':2
      })),
      transition('default=>active',[
        animate('500ms ease-in-out')
      ]),
      transition('active=>default',[
        animate('250ms ease-in-out')
      ]),
      transition('deleting => *',[
        animate('100ms')
      ]),
      transition('* => deleting',[
        animate('300ms')
      ]),
      transition(':enter', [
        query('.comment-text,.comment-date',[
          style({
            opacity:0
          }),
        ]),
        style({
            transform: 'translateX(-100%)',
            opacity: 0,
            'background-color': 'rgb(201, 157, 242)',
        }),
        animate('500ms ease-out', style({
            transform: 'translateX(0)',
            opacity: 1,
            'background-color': 'white',
        })),
        group([
          sequence([
            animate('250ms', style({
              'background-color': 'rgb(100,20,55,)',
            })),
            animate('150ms', style({
              'background-color': 'yellow',
            }))
          ]),

          query('.comment-text',[
            animate('50ms',style({
              opacity:1
            })),
          ]),
            query('.comment-date',[
              animate('200ms',style({
                opacity:1
              })),
          ])
        ])
      ]),
    ])
  ]
})
export class CommentsComponent implements OnInit{

  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();
  animationStates:{[key:number]:'default'|'active'}={}
  commentCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);
    // *******initialiser l'animation***************
    for(let index in this.comments){
      this.animationStates[index]='default'
    }
  }
  // ***********Laisser un commentaire***************************
  onLeaveComment() {
    if (this.commentCtrl.invalid) {
        return;
    }
    const maxId= Math.max(...this.comments.map(comment=>comment.id));
    this.comments.unshift({
      id:maxId+1,
      comment:this.commentCtrl.value,
      createdDate:new Date().toISOString(),
      userId:1
    })
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
}

// ***************Animation*****************************************
onListItemMouseEnter(index:number) {
  this.animationStates[index] = 'active';
}

onListItemMouseLeave(index:number) {
  this.animationStates[index] = 'default';
}
}
