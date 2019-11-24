import { HomeComponent } from "./home/home.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { ListsComponent } from "./lists/lists.component";
import { MessagesComponent } from "./messages/messages.component";
import { Routes } from '@angular/router';
import { AuthGuard } from "./_guards/auth.guard";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberListResolver } from "./_resolvers/member-list.resolver";
import { MemberDetailResolver } from "./_resolvers/member-detail.resolver";
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { PreventUnsavedChangesGuard } from "./_guards/prevent-unsaved-changes.guard";

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { 
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent, resolve: { users: MemberListResolver} },
            { path: 'members/edit', component: MemberEditComponent, 
                resolve: { user: MemberEditResolver }, canDeactivate: [PreventUnsavedChangesGuard] },
            { path: 'members/:id', component: MemberDetailComponent, resolve: { user: MemberDetailResolver } },
            { path: 'lists', component: ListsComponent},
            { path: 'messages', component: MessagesComponent}
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];