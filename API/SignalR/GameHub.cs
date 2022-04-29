using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using System.Collections.Generic;

namespace API.SignalR
{
    [Authorize]
    public class GameHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;

        public GameHub(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> DeleteGame(int gameId)
        {
            var game = await _unitOfWork.Games.GetOne(expression: (x) => x.Id == gameId);

            if(game == null)
            {
                throw new HubException("Game not found");
            }

            await _unitOfWork.Games.DeleteOne(gameId);

            if (await _unitOfWork.Complete())
            {
                await Clients.All.SendAsync("GameDeleted", game.Id);
                return "Game deleted";
            }

            throw new HubException("An error occurred");
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPost("add-game")]
        public async Task<string> AddGame(NewGameDto gameDto)
        {
            var game = new Game
            {
                Name = gameDto.Name,
                GameTypeId = gameDto.GameTypeId,
                Answer = gameDto.Answer,
                LettersGrid = gameDto.LettersGrid,
                Words = gameDto.Words,
                Scores = new List<Score>(),
                GameTypeName = gameDto.GameTypeName
            };

            await _unitOfWork.Games.InsertOne(game);

            if (await _unitOfWork.Complete())
            {
                await Clients.All.SendAsync("GameAdded", new GameDto            
                {
                    Id = game.Id,
                    Name = game.Name,
                    Answer = game.Answer,
                    GameTypeId = game.GameTypeId,
                    GameTypeName = game.GameTypeName,
                    Status = game.Status,
                    Scores = game.Scores.Select(s => new ScoreDto
                    {
                        Total = s.Total,
                        UserId = s.UserId,
                        GameId = s.GameId,
                        UserName = s.UserName,
                        GameName = s.GameName
                    }).ToList()
                });

                return "Game added";
            }

            throw new HubException("Error adding game");
        }
    }
}