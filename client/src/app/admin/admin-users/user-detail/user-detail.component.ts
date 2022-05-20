import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Player } from 'src/app/_models/player';
import { ReqRes } from 'src/app/_models/reqres';
import { PlayerService } from 'src/app/_services/player.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() player: Player;

  constructor(private playerService: PlayerService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  deletePlayer(playerId: number) {
    this.playerService.deletePlayer(playerId).subscribe((response: ReqRes) => {
      this.toastr.success(response.message);
      this.router.navigate(['/admin', 'users']);
    }, error => {
      this.toastr.error(error.error);
    });
  }

}
