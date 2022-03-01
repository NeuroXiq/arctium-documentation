using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using arctium_website.Database;
using arctium_website.Database.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace arctium_website
{
    public class Startup
    {
        public static string WebRootPath = "";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddMvc();

            services.AddScoped<SQLiteDb>();
            services.AddScoped<IAlgorithmSummaryRepository, AlgorithmSummaryRepository>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            SQLiteDb.Init();

            WebRootPath = env.WebRootPath;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseRouting();

            app.UseEndpoints(routes =>
            {

                routes.MapControllerRoute(
                    name: "short",
                    pattern: "{subpage?}",
                    defaults: new { controller = "Home", action = "Index" });

                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=Home}/{action=Index}");
            });
        }
    }
}
