using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace API.Data
{
    public class Seed
    {

        public static async Task SeedUsers(IConfiguration config, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if(await userManager.Users.AnyAsync())
            {
                return;
            }

            var roles = new List<AppRole>
            {
                new AppRole { Name = "Admin" },
                new AppRole { Name = "Member" }
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            var admin = new AppUser
            {
                UserName = config.GetValue<string>("SeedAdmin:Name"),
            };

            await userManager.CreateAsync(admin, config.GetValue<string>("SeedAdmin:Password"));

            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}